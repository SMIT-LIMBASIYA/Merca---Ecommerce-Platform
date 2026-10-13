-- ============================================================================
-- V006: Orders — orders, seller_orders, order_items, order_status_history
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- orders: Customer's completed purchase with full snapshots
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE orders (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id             BIGINT          NOT NULL,
    order_number            VARCHAR(30)     NOT NULL,   -- human-readable: ORD-20260915-000001
    idempotency_key         UUID            NOT NULL,   -- prevents duplicate checkout
    -- Item summary
    item_count              INT             NOT NULL,
    -- PRICE BREAKDOWN (all snapshotted, never change after creation)
    subtotal_cents          BIGINT          NOT NULL,
    tax_cents               BIGINT          NOT NULL DEFAULT 0,
    shipping_cents          BIGINT          NOT NULL DEFAULT 0,
    discount_cents          BIGINT          NOT NULL DEFAULT 0,
    total_cents             BIGINT          NOT NULL,
    currency                VARCHAR(3)      NOT NULL DEFAULT 'INR',
    -- Customer context
    notes                   TEXT,           -- delivery instructions
    ip_address              VARCHAR(45),
    user_agent              TEXT,
    -- Delivery tracking
    estimated_delivery_date DATE,
    delivered_at            TIMESTAMPTZ,
    -- Cancellation
    cancelled_at            TIMESTAMPTZ,
    cancelled_reason        TEXT,
    cancelled_by            VARCHAR(20),    -- CUSTOMER, SELLER, ADMIN, SYSTEM
    -- Status
    status                  VARCHAR(30)     NOT NULL DEFAULT 'PENDING_PAYMENT',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE RESTRICT,
    CONSTRAINT uq_orders_order_number       UNIQUE (order_number),
    CONSTRAINT uq_orders_idempotency        UNIQUE (idempotency_key),
    CONSTRAINT chk_orders_item_count        CHECK (item_count > 0),
    CONSTRAINT chk_orders_subtotal          CHECK (subtotal_cents >= 0),
    CONSTRAINT chk_orders_tax               CHECK (tax_cents >= 0),
    CONSTRAINT chk_orders_shipping          CHECK (shipping_cents >= 0),
    CONSTRAINT chk_orders_discount          CHECK (discount_cents >= 0),
    CONSTRAINT chk_orders_total             CHECK (total_cents >= 0),
    CONSTRAINT chk_orders_cancelled_by
        CHECK (cancelled_by IS NULL OR cancelled_by IN ('CUSTOMER', 'SELLER', 'ADMIN', 'SYSTEM')),
    CONSTRAINT chk_orders_status
        CHECK (status IN (
            'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING',
            'PARTIALLY_SHIPPED', 'SHIPPED', 'DELIVERED', 'COMPLETED',
            'CANCELLED', 'REFUND_PENDING', 'REFUNDED'
        ))
);

CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);
CREATE INDEX idx_orders_order_number ON orders (order_number);   -- fast lookup by order number
CREATE INDEX idx_orders_status_created ON orders (status, created_at);
-- Partial: stale payment reaper
CREATE INDEX idx_orders_pending_payment
    ON orders (created_at)
    WHERE status = 'PENDING_PAYMENT';


-- ──────────────────────────────────────────────────────────────────────────
-- order_addresses: Immutable normalized address snapshots (Shipping & Billing)
-- Extracted from orders to satisfy 3NF and reduce row footprint
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE order_addresses (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id                BIGINT          NOT NULL,
    address_type            VARCHAR(10)     NOT NULL,   -- 'SHIPPING' or 'BILLING'
    recipient_name          VARCHAR(200)    NOT NULL,
    phone                   VARCHAR(20)     NOT NULL,
    alternate_phone         VARCHAR(20),
    street_line1            VARCHAR(255)    NOT NULL,
    street_line2            VARCHAR(255),
    landmark                VARCHAR(255),
    city                    VARCHAR(100)    NOT NULL,
    district                VARCHAR(100),
    state                   VARCHAR(100)    NOT NULL,
    postal_code             VARCHAR(20)     NOT NULL,
    country                 VARCHAR(3)      NOT NULL DEFAULT 'IND',
    latitude                NUMERIC(10,7),
    longitude               NUMERIC(10,7),
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_order_addresses_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT chk_order_addresses_type
        CHECK (address_type IN ('SHIPPING', 'BILLING')),
    CONSTRAINT uq_order_address_type
        UNIQUE (order_id, address_type)
);

CREATE INDEX idx_order_addresses_order ON order_addresses (order_id);


-- ──────────────────────────────────────────────────────────────────────────
-- order_discounts: Normalized promotional discount snapshots
-- Supports multi-discount attribution (Coupons, Gift Cards, Bank Offers)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE order_discounts (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id                BIGINT          NOT NULL,
    discount_type           VARCHAR(30)     NOT NULL DEFAULT 'COUPON',
    coupon_id               BIGINT,
    code                    VARCHAR(50),
    description             VARCHAR(255),
    amount_cents            BIGINT          NOT NULL,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_order_discounts_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT chk_order_discounts_type
        CHECK (discount_type IN ('COUPON', 'PROMOTION', 'GIFT_CARD', 'CASHBACK', 'LOYALTY_POINTS')),
    CONSTRAINT chk_order_discounts_amount
        CHECK (amount_cents > 0)
);

CREATE INDEX idx_order_discounts_order ON order_discounts (order_id);
CREATE INDEX idx_order_discounts_coupon ON order_discounts (coupon_id) WHERE coupon_id IS NOT NULL;


-- ──────────────────────────────────────────────────────────────────────────
-- seller_orders: Per-seller fulfillment grouping within a customer order
--
-- ORDER #1001 (Customer Alice)
--   ├─ SELLER_ORDER #SO-001 (ElectroWorld)  → tracking TRK123, shipped via Delhivery
--   │    ├─ ORDER_ITEM: iPhone 17 Pro  ×1
--   │    └─ ORDER_ITEM: USB-C Charger  ×2
--   └─ SELLER_ORDER #SO-002 (KeyboardKing) → tracking TRK456, shipped via BlueDart
--        └─ ORDER_ITEM: Mechanical Keyboard ×1
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE seller_orders (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id                BIGINT          NOT NULL,
    seller_id               BIGINT          NOT NULL,
    seller_order_number     VARCHAR(30)     NOT NULL,
    -- Financials
    subtotal_cents          BIGINT          NOT NULL,
    tax_cents               BIGINT          NOT NULL DEFAULT 0,
    shipping_fee_cents      BIGINT          NOT NULL DEFAULT 0,
    discount_cents          BIGINT          NOT NULL DEFAULT 0,
    total_cents             BIGINT          NOT NULL,
    -- Platform financials
    commission_rate         NUMERIC(5,2)    NOT NULL,
    commission_cents        BIGINT          NOT NULL DEFAULT 0,
    seller_payout_cents     BIGINT          NOT NULL DEFAULT 0,
    currency                VARCHAR(3)      NOT NULL DEFAULT 'INR',
    -- Items
    item_count              INT             NOT NULL,
    -- Shipping & tracking
    tracking_number         VARCHAR(100),
    shipping_provider       VARCHAR(100),
    shipping_method         VARCHAR(50),
    shipped_at              TIMESTAMPTZ,
    out_for_delivery_at     TIMESTAMPTZ,
    delivered_at            TIMESTAMPTZ,
    estimated_delivery_date DATE,
    return_deadline         DATE,
    -- Notes
    seller_notes            TEXT,
    admin_notes             TEXT,
    -- Cancellation
    cancelled_at            TIMESTAMPTZ,
    cancelled_reason        TEXT,
    cancelled_by            VARCHAR(20),
    -- Status (independent per seller)
    status                  VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_seller_orders_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_seller_orders_seller
        FOREIGN KEY (seller_id) REFERENCES sellers (user_id) ON DELETE RESTRICT,
    CONSTRAINT uq_seller_orders_order_seller    UNIQUE (order_id, seller_id),
    CONSTRAINT uq_seller_orders_number          UNIQUE (seller_order_number),
    CONSTRAINT chk_so_subtotal                  CHECK (subtotal_cents >= 0),
    CONSTRAINT chk_so_total                     CHECK (total_cents >= 0),
    CONSTRAINT chk_so_item_count                CHECK (item_count > 0),
    CONSTRAINT chk_so_commission_rate           CHECK (commission_rate >= 0 AND commission_rate <= 100),
    CONSTRAINT chk_so_cancelled_by
        CHECK (cancelled_by IS NULL OR cancelled_by IN ('CUSTOMER', 'SELLER', 'ADMIN', 'SYSTEM')),
    CONSTRAINT chk_so_status
        CHECK (status IN (
            'PENDING', 'CONFIRMED', 'PROCESSING',
            'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED',
            'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'
        ))
);

CREATE INDEX idx_seller_orders_seller_created ON seller_orders (seller_id, created_at DESC);
CREATE INDEX idx_seller_orders_seller_status_created ON seller_orders (seller_id, status, created_at DESC);
CREATE INDEX idx_seller_orders_status ON seller_orders (status) WHERE status NOT IN ('DELIVERED', 'CANCELLED');
CREATE INDEX idx_seller_orders_tracking ON seller_orders (tracking_number) WHERE tracking_number IS NOT NULL;


-- ──────────────────────────────────────────────────────────────────────────
-- order_items: Individual line items with ALL purchase-time snapshots
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE order_items (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seller_order_id     BIGINT          NOT NULL,
    listing_id          BIGINT          NOT NULL,
    -- Quantity & pricing (ALL SNAPSHOTTED — never change after creation)
    quantity            INT             NOT NULL,
    unit_price_cents    BIGINT          NOT NULL,
    mrp_cents           BIGINT,
    tax_rate            NUMERIC(5,2)    NOT NULL DEFAULT 0,
    tax_cents           BIGINT          NOT NULL DEFAULT 0,
    discount_cents      BIGINT          NOT NULL DEFAULT 0,
    shipping_fee_cents  BIGINT          NOT NULL DEFAULT 0,
    line_total_cents    BIGINT          NOT NULL,   -- final: (unit_price × qty) + tax + ship - discount
    currency            VARCHAR(3)      NOT NULL DEFAULT 'INR',
    -- SNAPSHOTS (frozen at checkout — order history must be readable forever)
    product_id          BIGINT          NOT NULL,
    product_title       VARCHAR(500)    NOT NULL,
    product_image_url   VARCHAR(1024),
    product_slug        VARCHAR(500),
    seller_name         VARCHAR(255)    NOT NULL,
    seller_sku          VARCHAR(100),
    listing_condition   VARCHAR(20)     NOT NULL DEFAULT 'NEW',
    -- Return tracking per item
    is_returnable       BOOLEAN         NOT NULL DEFAULT TRUE,
    return_window_days  SMALLINT,
    return_status       VARCHAR(20),

    CONSTRAINT fk_oi_seller_order
        FOREIGN KEY (seller_order_id) REFERENCES seller_orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_oi_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE RESTRICT,
    CONSTRAINT uq_oi_seller_order_listing   UNIQUE (seller_order_id, listing_id),
    CONSTRAINT chk_oi_quantity              CHECK (quantity > 0),
    CONSTRAINT chk_oi_price                 CHECK (unit_price_cents >= 0),
    CONSTRAINT chk_oi_tax                   CHECK (tax_cents >= 0),
    CONSTRAINT chk_oi_discount              CHECK (discount_cents >= 0),
    CONSTRAINT chk_oi_line_total            CHECK (line_total_cents >= 0),
    CONSTRAINT chk_oi_return_status
        CHECK (return_status IS NULL OR return_status IN (
            'ELIGIBLE', 'REQUESTED', 'APPROVED', 'REJECTED',
            'PICKED_UP', 'RECEIVED', 'REFUNDED'
        ))
);

CREATE INDEX idx_oi_listing ON order_items (listing_id);
CREATE INDEX idx_oi_product ON order_items (product_id);


-- ──────────────────────────────────────────────────────────────────────────
-- order_status_history: Audit trail for every order state transition
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE order_status_history (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id            BIGINT          NOT NULL,
    seller_order_id     BIGINT,                    -- NULL = master order change
    previous_status     VARCHAR(30),               -- NULL for initial creation
    new_status          VARCHAR(30)     NOT NULL,
    changed_by_user_id  BIGINT,
    changed_by_role     VARCHAR(20),
    reason              TEXT,
    metadata            JSONB,                     -- flexible context (tracking info, etc.)
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_osh_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_osh_seller_order
        FOREIGN KEY (seller_order_id) REFERENCES seller_orders (id) ON DELETE RESTRICT,
    CONSTRAINT fk_osh_user
        FOREIGN KEY (changed_by_user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX idx_osh_order ON order_status_history (order_id, created_at);
CREATE INDEX idx_osh_seller_order ON order_status_history (seller_order_id, created_at)
    WHERE seller_order_id IS NOT NULL;
