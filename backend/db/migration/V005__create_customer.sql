-- ============================================================================
-- V005: Customer — Addresses, Carts, Cart Items
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- addresses: Saved delivery addresses with recipient details & geolocation
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE addresses (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     BIGINT          NOT NULL,
    label           VARCHAR(50),               -- 'Home', 'Office', etc.
    recipient_name  VARCHAR(200)    NOT NULL,   -- may differ from customer name
    phone           VARCHAR(20)     NOT NULL,   -- delivery contact
    alternate_phone VARCHAR(20),
    street_line1    VARCHAR(255)    NOT NULL,
    street_line2    VARCHAR(255),
    landmark        VARCHAR(255),
    city            VARCHAR(100)    NOT NULL,
    district        VARCHAR(100),
    state           VARCHAR(100)    NOT NULL,
    postal_code     VARCHAR(20)     NOT NULL,
    country         VARCHAR(3)      NOT NULL DEFAULT 'IND',
    address_type    VARCHAR(20)     NOT NULL DEFAULT 'HOME',
    -- Geolocation (for delivery optimization)
    latitude        NUMERIC(10,7),
    longitude       NUMERIC(10,7),
    -- Defaults
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_addresses_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_addresses_type
        CHECK (address_type IN ('HOME', 'OFFICE', 'OTHER'))
);

CREATE INDEX idx_addresses_customer ON addresses (customer_id);
-- Ensure only one default address per customer
CREATE UNIQUE INDEX uq_addresses_customer_default ON addresses (customer_id) WHERE is_default = TRUE;


-- ──────────────────────────────────────────────────────────────────────────
-- carts: One active cart per customer
--
-- Carts do NOT reserve inventory. A listing may go out of stock while in
-- a cart. Validation happens at checkout time.
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE carts (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     BIGINT          NOT NULL,
    item_count      INT             NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ,     -- for abandoned cart cleanup

    CONSTRAINT fk_carts_customer
        FOREIGN KEY (customer_id) REFERENCES customers (user_id) ON DELETE CASCADE,
    CONSTRAINT uq_carts_customer    UNIQUE (customer_id),
    CONSTRAINT chk_carts_item_count CHECK (item_count >= 0)
);


-- ──────────────────────────────────────────────────────────────────────────
-- cart_items: Individual listing in a cart
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE cart_items (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cart_id             BIGINT          NOT NULL,
    listing_id          BIGINT          NOT NULL,
    quantity            INT             NOT NULL DEFAULT 1,
    -- Price snapshot at time of addition (for "price changed" detection)
    price_at_addition   BIGINT          NOT NULL,
    currency            VARCHAR(3)      NOT NULL DEFAULT 'INR',
    added_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE RESTRICT,
    CONSTRAINT uq_cart_items_cart_listing    UNIQUE (cart_id, listing_id),
    CONSTRAINT chk_cart_items_quantity       CHECK (quantity > 0),
    CONSTRAINT chk_cart_items_price          CHECK (price_at_addition > 0)
);

CREATE INDEX idx_cart_items_listing ON cart_items (listing_id);
