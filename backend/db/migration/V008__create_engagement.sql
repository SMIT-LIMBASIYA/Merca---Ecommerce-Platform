-- ============================================================================
-- V008: Engagement — Reviews, Review Images, Wishlists, Wishlist Items
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- reviews: Product reviews (one per customer per product)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id              BIGINT          NOT NULL,
    customer_id             BIGINT          NOT NULL,
    order_item_id           BIGINT,                    -- link to the specific purchase
    -- Review content
    rating                  SMALLINT        NOT NULL,
    title                   VARCHAR(255),
    body                    TEXT,
    pros                    TEXT,
    cons                    TEXT,
    -- Verification
    is_verified_purchase    BOOLEAN         NOT NULL DEFAULT FALSE,
    -- Community voting
    helpful_count           INT             NOT NULL DEFAULT 0,
    not_helpful_count       INT             NOT NULL DEFAULT 0,
    -- Moderation
    status                  VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    moderation_note         TEXT,
    moderated_by            BIGINT,
    moderated_at            TIMESTAMPTZ,
    -- Seller response
    seller_response         TEXT,
    seller_responded_at     TIMESTAMPTZ,
    -- Timestamps
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_order_item
        FOREIGN KEY (order_item_id) REFERENCES order_items (id) ON DELETE SET NULL,
    CONSTRAINT fk_reviews_moderator
        FOREIGN KEY (moderated_by) REFERENCES users (id) ON DELETE SET NULL,
    -- One review per customer per product
    CONSTRAINT uq_reviews_customer_product  UNIQUE (customer_id, product_id),
    CONSTRAINT chk_reviews_rating           CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT chk_reviews_helpful          CHECK (helpful_count >= 0),
    CONSTRAINT chk_reviews_not_helpful      CHECK (not_helpful_count >= 0),
    CONSTRAINT chk_reviews_status
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'))
);

-- Product detail page: approved reviews, newest first
CREATE INDEX idx_reviews_product_approved
    ON reviews (product_id, created_at DESC)
    WHERE status = 'APPROVED';
-- Customer's review history
CREATE INDEX idx_reviews_customer ON reviews (customer_id, created_at DESC);
-- Moderation queue
CREATE INDEX idx_reviews_pending ON reviews (created_at) WHERE status = 'PENDING';
-- Verified purchase lookup by order item
CREATE INDEX idx_reviews_order_item ON reviews (order_item_id) WHERE order_item_id IS NOT NULL;


-- ──────────────────────────────────────────────────────────────────────────
-- review_images: Photos attached to reviews
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE review_images (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_id       BIGINT          NOT NULL,
    image_url       VARCHAR(1024)   NOT NULL,
    thumbnail_url   VARCHAR(1024),
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_review_images_review
        FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE
);

CREATE INDEX idx_review_images_review ON review_images (review_id, display_order);


-- ──────────────────────────────────────────────────────────────────────────
-- wishlists: Named collections of saved products
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE wishlists (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     BIGINT          NOT NULL,
    name            VARCHAR(100)    NOT NULL DEFAULT 'My Wishlist',
    is_default      BOOLEAN         NOT NULL DEFAULT TRUE,
    is_public       BOOLEAN         NOT NULL DEFAULT FALSE,
    item_count      INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_wishlists_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_wishlists_count  CHECK (item_count >= 0)
);

CREATE INDEX idx_wishlists_customer ON wishlists (customer_id);
-- Ensure only one default wishlist per customer
CREATE UNIQUE INDEX uq_wishlists_customer_default ON wishlists (customer_id) WHERE is_default = TRUE;


-- ──────────────────────────────────────────────────────────────────────────
-- wishlist_items: Products saved in a wishlist
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE wishlist_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    wishlist_id     BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    note            TEXT,
    added_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_wi_wishlist
        FOREIGN KEY (wishlist_id) REFERENCES wishlists (id) ON DELETE CASCADE,
    CONSTRAINT fk_wi_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT uq_wi_wishlist_product   UNIQUE (wishlist_id, product_id)
);
