-- ============================================================================
-- V009: Promotions & Returns — coupons, coupon_usage, return_requests
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- coupons: Promotional discount codes
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE coupons (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code                    VARCHAR(50)     NOT NULL,
    title                   VARCHAR(255),
    description             TEXT,
    -- Discount definition
    discount_type           VARCHAR(20)     NOT NULL,
    discount_value          BIGINT          NOT NULL,   -- paise for FIXED, basis points for % (1000 = 10%)
    min_order_cents         BIGINT          NOT NULL DEFAULT 0,
    max_discount_cents      BIGINT,                     -- cap for percentage discounts
    currency                VARCHAR(3)      NOT NULL DEFAULT 'INR',
    -- Usage limits
    usage_limit             INT,                        -- total uses (NULL = unlimited)
    per_user_limit          INT             NOT NULL DEFAULT 1,
    times_used              INT             NOT NULL DEFAULT 0,
    -- Targeting
    applicable_to           VARCHAR(30)     NOT NULL DEFAULT 'ALL',
    applicable_ids          BIGINT[],                   -- product/category/seller IDs if targeted
    -- First-order flag
    first_order_only        BOOLEAN         NOT NULL DEFAULT FALSE,
    -- Validity window
    starts_at               TIMESTAMPTZ     NOT NULL,
    expires_at              TIMESTAMPTZ     NOT NULL,
    is_active               BOOLEAN         NOT NULL DEFAULT TRUE,
    -- Admin
    created_by              BIGINT,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT uq_coupons_code              UNIQUE (code),
    CONSTRAINT fk_coupons_creator
        FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_coupons_type
        CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING')),
    CONSTRAINT chk_coupons_value            CHECK (discount_value > 0),
    CONSTRAINT chk_coupons_min_order        CHECK (min_order_cents >= 0),
    CONSTRAINT chk_coupons_applicable
        CHECK (applicable_to IN ('ALL', 'SPECIFIC_PRODUCTS', 'SPECIFIC_CATEGORIES', 'SPECIFIC_SELLERS', 'FIRST_ORDER')),
    CONSTRAINT chk_coupons_dates            CHECK (expires_at > starts_at),
    CONSTRAINT chk_coupons_times_used       CHECK (times_used >= 0)
);

-- Active coupon lookup by code
CREATE INDEX idx_coupons_code_active ON coupons (code) WHERE is_active = TRUE;
-- Admin: list coupons by date
CREATE INDEX idx_coupons_active_dates ON coupons (starts_at, expires_at) WHERE is_active = TRUE;


-- ──────────────────────────────────────────────────────────────────────────
-- coupon_usage: Tracks who used which coupon on which order
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE coupon_usage (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    coupon_id               BIGINT          NOT NULL,
    customer_id             BIGINT          NOT NULL,
    order_id                BIGINT          NOT NULL,
    discount_amount_cents   BIGINT          NOT NULL,
    used_at                 TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_cu_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons (id) ON DELETE RESTRICT,
    CONSTRAINT fk_cu_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_cu_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    CONSTRAINT chk_cu_discount              CHECK (discount_amount_cents > 0)
);

-- Per-user usage check: how many times has customer X used coupon Y?
CREATE INDEX idx_cu_coupon_customer ON coupon_usage (coupon_id, customer_id);
CREATE INDEX idx_cu_order ON coupon_usage (order_id);


-- ──────────────────────────────────────────────────────────────────────────
-- return_requests: Post-purchase return/refund workflow
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE return_requests (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_item_id           BIGINT          NOT NULL,
    customer_id             BIGINT          NOT NULL,
    seller_order_id         BIGINT          NOT NULL,
    -- Reason
    reason                  VARCHAR(50)     NOT NULL,
    description             TEXT,
    -- Return images (JSONB array of URLs for simplicity)
    images                  JSONB,
    -- Refund
    refund_amount_cents     BIGINT,
    refund_method           VARCHAR(30),
    -- Pickup tracking
    pickup_address_snapshot JSONB,
    pickup_tracking_number  VARCHAR(100),
    pickup_provider         VARCHAR(100),
    pickup_scheduled_at     TIMESTAMPTZ,
    picked_up_at            TIMESTAMPTZ,
    -- Receiving & QC
    received_at             TIMESTAMPTZ,
    quality_check_status    VARCHAR(20),
    quality_check_notes     TEXT,
    -- Resolution
    admin_notes             TEXT,
    approved_by             BIGINT,
    approved_at             TIMESTAMPTZ,
    rejected_reason         TEXT,
    refunded_at             TIMESTAMPTZ,
    -- Status
    status                  VARCHAR(20)     NOT NULL DEFAULT 'REQUESTED',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_rr_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items (id) ON DELETE RESTRICT,
    CONSTRAINT fk_rr_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_rr_seller_order
        FOREIGN KEY (seller_order_id) REFERENCES seller_orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_rr_approver
        FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_rr_reason
        CHECK (reason IN (
            'DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'DAMAGED_IN_TRANSIT',
            'SIZE_FIT_ISSUE', 'CHANGED_MIND', 'BETTER_PRICE_AVAILABLE', 'OTHER'
        )),
    CONSTRAINT chk_rr_refund_method
        CHECK (refund_method IS NULL OR refund_method IN (
            'ORIGINAL_METHOD', 'STORE_CREDIT', 'BANK_TRANSFER', 'UPI'
        )),
    CONSTRAINT chk_rr_qc_status
        CHECK (quality_check_status IS NULL OR quality_check_status IN (
            'PENDING', 'PASSED', 'FAILED'
        )),
    CONSTRAINT chk_rr_status
        CHECK (status IN (
            'REQUESTED', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED',
            'PICKED_UP', 'RECEIVED', 'QUALITY_CHECK', 'REFUND_INITIATED',
            'REFUNDED', 'CLOSED'
        ))
);

CREATE INDEX idx_rr_customer ON return_requests (customer_id, created_at DESC);
CREATE INDEX idx_rr_seller_order ON return_requests (seller_order_id);
CREATE INDEX idx_rr_order_item ON return_requests (order_item_id);
-- Ensure an item cannot have multiple open return requests simultaneously
CREATE UNIQUE INDEX uq_rr_active_order_item ON return_requests (order_item_id)
    WHERE status NOT IN ('REJECTED', 'CLOSED');
-- Active return requests (for processing queue)
CREATE INDEX idx_rr_active ON return_requests (status, created_at)
    WHERE status NOT IN ('REFUNDED', 'CLOSED', 'REJECTED');
