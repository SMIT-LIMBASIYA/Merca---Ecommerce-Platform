-- ============================================================================
-- V004: Marketplace — Listings, Inventory, Inventory Ledger
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- listings: A seller's offer to sell a specific product
--
-- PRODUCT = "what it is"     (iPhone 17 Pro)
-- LISTING = "who sells it"   (Seller A @ ₹1,39,999, NEW, ships in 2 days)
--
-- Price, shipping terms, return policy — all per-listing, NOT per-product.
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE listings (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id                      BIGINT          NOT NULL,
    seller_id                       BIGINT          NOT NULL,
    -- Seller's own identifiers
    seller_sku                      VARCHAR(100),
    barcode                         VARCHAR(50),     -- UPC / EAN / ISBN
    -- Seller-specific display overrides
    title_override                  VARCHAR(500),    -- if seller wants a different title
    description                     TEXT,            -- seller-specific notes
    -- Pricing (all in minor units / paise)
    price_cents                     BIGINT          NOT NULL,
    mrp_cents                       BIGINT,          -- maximum retail price (for discount display)
    cost_price_cents                BIGINT,          -- seller's cost (internal, for margin calc)
    currency                        VARCHAR(3)      NOT NULL DEFAULT 'INR',
    tax_rate                        NUMERIC(5,2)    NOT NULL DEFAULT 18.00,   -- GST rate %
    -- Condition
    condition                       VARCHAR(20)     NOT NULL DEFAULT 'NEW',
    -- Order constraints
    min_order_quantity              INT             NOT NULL DEFAULT 1,
    max_order_quantity              INT             NOT NULL DEFAULT 10,
    -- Shipping
    shipping_fee_cents              BIGINT          NOT NULL DEFAULT 0,
    free_shipping_threshold_cents   BIGINT,          -- orders above this → free shipping
    estimated_delivery_days         SMALLINT,
    handling_time_days              SMALLINT        NOT NULL DEFAULT 1,   -- days to ship after order
    -- Weight override (may differ from product.weight_grams for this seller's packaging)
    weight_grams                    INT,
    -- Returns & warranty
    is_returnable                   BOOLEAN         NOT NULL DEFAULT TRUE,
    return_window_days              SMALLINT        NOT NULL DEFAULT 7,
    warranty_days                   SMALLINT,
    -- Payment options
    is_cod_available                BOOLEAN         NOT NULL DEFAULT TRUE,
    -- Lifecycle
    status                          VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    activated_at                    TIMESTAMPTZ,
    deactivated_at                  TIMESTAMPTZ,
    suspended_at                    TIMESTAMPTZ,
    suspended_reason                TEXT,
    suspended_by                    BIGINT,          -- admin who suspended
    -- Denormalized
    total_sold                      INT             NOT NULL DEFAULT 0,
    view_count                      INT             NOT NULL DEFAULT 0,
    -- Timestamps
    created_at                      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at                      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_listings_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
    CONSTRAINT fk_listings_seller
        FOREIGN KEY (seller_id) REFERENCES sellers (user_id) ON DELETE RESTRICT,
    CONSTRAINT uq_listings_product_seller   UNIQUE (product_id, seller_id),
    CONSTRAINT chk_listings_price           CHECK (price_cents > 0),
    CONSTRAINT chk_listings_mrp             CHECK (mrp_cents IS NULL OR mrp_cents >= price_cents),
    CONSTRAINT chk_listings_tax             CHECK (tax_rate >= 0 AND tax_rate <= 100),
    CONSTRAINT chk_listings_min_qty         CHECK (min_order_quantity > 0),
    CONSTRAINT chk_listings_max_qty         CHECK (max_order_quantity >= min_order_quantity),
    CONSTRAINT chk_listings_shipping        CHECK (shipping_fee_cents >= 0),
    CONSTRAINT chk_listings_handling        CHECK (handling_time_days >= 0),
    CONSTRAINT chk_listings_condition
        CHECK (condition IN ('NEW', 'LIKE_NEW', 'REFURBISHED', 'USED')),
    CONSTRAINT chk_listings_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- THE highest-frequency query: active offers for a product, cheapest first
CREATE INDEX idx_listings_product_active_price
    ON listings (product_id, price_cents)
    INCLUDE (seller_id, currency, condition, mrp_cents, shipping_fee_cents, estimated_delivery_days)
    WHERE status = 'ACTIVE';

-- Seller dashboard: "my listings"
CREATE INDEX idx_listings_seller_status ON listings (seller_id, status);

-- Seller SKU lookup
CREATE INDEX idx_listings_seller_sku ON listings (seller_id, seller_sku) WHERE seller_sku IS NOT NULL;

-- Barcode lookup (global)
CREATE INDEX idx_listings_barcode ON listings (barcode) WHERE barcode IS NOT NULL;


-- ──────────────────────────────────────────────────────────────────────────
-- inventory: Real-time stock levels (write-hot, separated from listings)
--
-- WHY SEPARATE?
--   listings table is read 1000x more than written (catalog browsing).
--   inventory is written on EVERY purchase (checkout).
--   Same-row updates cause MVCC bloat, cache invalidation, and page churn
--   on the heavily-read listings table.
--
-- CONCURRENCY:
--   Atomic conditional update prevents overselling:
--   UPDATE inventory
--   SET available_quantity = available_quantity - ?,
--       reserved_quantity = reserved_quantity + ?
--   WHERE listing_id = ? AND available_quantity >= ?;
--
--   CHECK (available_quantity >= 0) is the database-level safety net.
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE inventory (
    listing_id          BIGINT      PRIMARY KEY,
    available_quantity  INT         NOT NULL DEFAULT 0,
    reserved_quantity   INT         NOT NULL DEFAULT 0,
    sold_quantity       INT         NOT NULL DEFAULT 0,
    -- Stock management
    low_stock_threshold INT         NOT NULL DEFAULT 5,
    reorder_point       INT,
    max_stock_level     INT,
    last_restocked_at   TIMESTAMPTZ,
    -- Optimistic locking for seller-side updates (Hibernate @Version)
    version             INT         NOT NULL DEFAULT 0,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_inventory_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE RESTRICT,
    CONSTRAINT chk_inventory_available      CHECK (available_quantity >= 0),
    CONSTRAINT chk_inventory_reserved       CHECK (reserved_quantity >= 0),
    CONSTRAINT chk_inventory_sold           CHECK (sold_quantity >= 0)
);

-- Alert query: low-stock listings
CREATE INDEX idx_inventory_low_stock
    ON inventory (listing_id)
    WHERE available_quantity <= low_stock_threshold AND available_quantity > 0;


-- ──────────────────────────────────────────────────────────────────────────
-- inventory_ledger: Immutable, append-only audit trail for every stock change
--
-- When inventory says available_quantity = 42, this table tells you
-- EXACTLY how it got there: +100 restock, -55 sold, -3 adjusted, etc.
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE inventory_ledger (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    listing_id          BIGINT          NOT NULL,
    change_type         VARCHAR(30)     NOT NULL,
    quantity_change     INT             NOT NULL,   -- + for increase, - for decrease
    -- State snapshot AFTER this change
    available_before    INT             NOT NULL,
    available_after     INT             NOT NULL,
    reserved_before     INT             NOT NULL,
    reserved_after      INT             NOT NULL,
    -- What caused this change
    reference_type      VARCHAR(30),    -- 'ORDER_ITEM', 'CANCELLATION', 'RETURN', 'ADMIN', 'SELLER'
    reference_id        BIGINT,
    operator_id         BIGINT,         -- user who triggered change (NULL for system)
    note                TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_inv_ledger_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_ledger_operator
        FOREIGN KEY (operator_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_inv_ledger_type
        CHECK (change_type IN ('RESTOCK', 'RESERVE', 'RELEASE', 'CONFIRM_SALE', 'RETURN', 'ADJUSTMENT'))
);

CREATE INDEX idx_inv_ledger_listing_time ON inventory_ledger (listing_id, created_at DESC);
CREATE INDEX idx_inv_ledger_reference ON inventory_ledger (reference_type, reference_id);
