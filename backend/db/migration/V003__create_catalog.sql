-- ============================================================================
-- V003: Catalog Foundation
-- Tables: categories, products, product_images, product_categories
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- categories: Hierarchical product classification
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id           BIGINT,
    name                VARCHAR(255)    NOT NULL,
    slug                VARCHAR(255)    NOT NULL,
    description         TEXT,
    -- Visual assets
    image_url           VARCHAR(1024),
    icon_url            VARCHAR(1024),
    -- Display
    display_order       SMALLINT        NOT NULL DEFAULT 0,
    level               SMALLINT        NOT NULL DEFAULT 0,     -- depth in tree (0 = root)
    -- SEO
    meta_title          VARCHAR(255),
    meta_description    VARCHAR(500),
    -- Denormalized count (updated by trigger or background job)
    product_count       INT             NOT NULL DEFAULT 0,
    -- Lifecycle
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE RESTRICT,
    CONSTRAINT uq_categories_slug       UNIQUE (slug),
    CONSTRAINT chk_categories_level     CHECK (level >= 0),
    CONSTRAINT chk_categories_count     CHECK (product_count >= 0)
);

CREATE INDEX idx_categories_parent ON categories (parent_id);
CREATE INDEX idx_categories_active_order ON categories (is_active, display_order) WHERE is_active = TRUE;


-- ──────────────────────────────────────────────────────────────────────────
-- products: Canonical catalog entity
-- CRITICAL: NO seller_id, NO price, NO stock here — those live in listings
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE products (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title               VARCHAR(500)    NOT NULL,
    slug                VARCHAR(500)    NOT NULL,
    description         TEXT,
    short_description   VARCHAR(1000),
    -- Brand & origin
    brand               VARCHAR(200),
    manufacturer        VARCHAR(200),
    model_number        VARCHAR(100),
    country_of_origin   VARCHAR(3),
    -- Physical dimensions (for shipping calculations)
    weight_grams        INT,
    length_mm           INT,
    width_mm            INT,
    height_mm           INT,
    -- Product attributes
    warranty_months     SMALLINT,
    is_digital          BOOLEAN         NOT NULL DEFAULT FALSE,
    is_featured         BOOLEAN         NOT NULL DEFAULT FALSE,
    -- Flexible specs (e.g., {"RAM": "8GB", "Color": "Black", "Storage": "256GB"})
    specifications      JSONB,
    -- Tags for filtering (e.g., ARRAY['5g', 'flagship', 'wireless-charging'])
    tags                TEXT[],
    -- SEO
    meta_title          VARCHAR(255),
    meta_description    VARCHAR(500),
    -- Denormalized aggregates (maintained by background jobs)
    avg_rating          NUMERIC(3,2)    NOT NULL DEFAULT 0.00,
    total_ratings       INT             NOT NULL DEFAULT 0,
    total_reviews       INT             NOT NULL DEFAULT 0,
    lowest_price_cents  BIGINT,                                -- cheapest active listing
    highest_price_cents BIGINT,                                -- most expensive active listing
    listing_count       INT             NOT NULL DEFAULT 0,    -- number of active listings
    -- Lifecycle
    status              VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    created_by          BIGINT,                                -- admin or system who created
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT uq_products_slug             UNIQUE (slug),
    CONSTRAINT chk_products_weight          CHECK (weight_grams IS NULL OR weight_grams > 0),
    CONSTRAINT chk_products_length          CHECK (length_mm IS NULL OR length_mm > 0),
    CONSTRAINT chk_products_width           CHECK (width_mm IS NULL OR width_mm > 0),
    CONSTRAINT chk_products_height          CHECK (height_mm IS NULL OR height_mm > 0),
    CONSTRAINT chk_products_avg_rating      CHECK (avg_rating >= 0 AND avg_rating <= 5),
    CONSTRAINT chk_products_status
        CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

-- Trigram GIN index for ILIKE substring search (stopgap before Elasticsearch)
CREATE INDEX idx_products_title_trgm ON products USING gin (title gin_trgm_ops);
-- Brand + status filtering
CREATE INDEX idx_products_brand_status ON products (brand, status) WHERE status = 'ACTIVE';
-- Featured products listing
CREATE INDEX idx_products_featured ON products (created_at DESC) WHERE is_featured = TRUE AND status = 'ACTIVE';
-- Tag-based filtering
CREATE INDEX idx_products_tags ON products USING gin (tags);
-- JSONB spec filtering (e.g., WHERE specifications->>'RAM' = '8GB')
CREATE INDEX idx_products_specs ON products USING gin (specifications jsonb_path_ops);
-- Active products for catalog browsing
CREATE INDEX idx_products_active ON products (status, created_at DESC) WHERE status = 'ACTIVE';


-- ──────────────────────────────────────────────────────────────────────────
-- product_images: Visual assets for products
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE product_images (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id      BIGINT          NOT NULL,
    image_url       VARCHAR(1024)   NOT NULL,
    thumbnail_url   VARCHAR(1024),
    alt_text        VARCHAR(255),
    width           SMALLINT,
    height          SMALLINT,
    file_size_bytes INT,
    display_order   SMALLINT        NOT NULL DEFAULT 0,
    is_primary      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product ON product_images (product_id, display_order);


-- ──────────────────────────────────────────────────────────────────────────
-- product_categories: M:N junction (product <-> category)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE product_categories (
    product_id      BIGINT NOT NULL,
    category_id     BIGINT NOT NULL,

    CONSTRAINT pk_product_categories    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_pc_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

-- Reverse lookup: "products in category X"
CREATE INDEX idx_pc_category ON product_categories (category_id);
