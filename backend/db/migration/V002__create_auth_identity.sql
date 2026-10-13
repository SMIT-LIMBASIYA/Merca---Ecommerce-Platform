-- ============================================================================
-- V002: Authentication & Identity
-- Tables: users, customers, sellers, seller_bank_accounts
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- users: Base authentication entity for all actors
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email                   VARCHAR(255)    NOT NULL,
    password_hash           VARCHAR(255)    NOT NULL,
    role                    VARCHAR(20)     NOT NULL,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    -- Verification
    email_verified          BOOLEAN         NOT NULL DEFAULT FALSE,
    email_verified_at       TIMESTAMPTZ,
    phone                   VARCHAR(20),
    phone_verified          BOOLEAN         NOT NULL DEFAULT FALSE,
    -- Profile
    avatar_url              VARCHAR(1024),
    locale                  VARCHAR(10)     NOT NULL DEFAULT 'en_IN',
    timezone                VARCHAR(50)     NOT NULL DEFAULT 'Asia/Kolkata',
    -- Security tracking
    last_login_at           TIMESTAMPTZ,
    last_login_ip           VARCHAR(45),       -- supports IPv6
    failed_login_attempts   SMALLINT        NOT NULL DEFAULT 0,
    locked_until            TIMESTAMPTZ,
    password_changed_at     TIMESTAMPTZ,
    -- Metadata
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT uq_users_email               UNIQUE (email),
    CONSTRAINT chk_users_role               CHECK (role IN ('CUSTOMER', 'SELLER', 'ADMIN')),
    CONSTRAINT chk_users_status             CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
    CONSTRAINT chk_users_failed_attempts    CHECK (failed_login_attempts >= 0)
);

-- Partial index: only active users for login queries
CREATE INDEX idx_users_email_active ON users (email) WHERE status = 'ACTIVE';


-- ──────────────────────────────────────────────────────────────────────────
-- customers: Customer-specific profile (1:1 subtype of users)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE customers (
    user_id         BIGINT          PRIMARY KEY,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    display_name    VARCHAR(200),
    date_of_birth   DATE,
    gender          VARCHAR(20),

    CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT chk_customers_gender
        CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'))
);


-- ──────────────────────────────────────────────────────────────────────────
-- sellers: Seller/business profile (1:1 subtype of users)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE sellers (
    user_id                 BIGINT          PRIMARY KEY,
    company_name            VARCHAR(255)    NOT NULL,
    display_name            VARCHAR(255),
    slug                    VARCHAR(255)    NOT NULL,
    -- Business details
    business_type           VARCHAR(20)     NOT NULL DEFAULT 'INDIVIDUAL',
    tax_id                  VARCHAR(100),
    gst_number              VARCHAR(15),
    pan_number              VARCHAR(10),
    business_email          VARCHAR(255),
    business_phone          VARCHAR(20),
    website_url             VARCHAR(1024),
    -- Branding
    logo_url                VARCHAR(1024),
    banner_url              VARCHAR(1024),
    description             TEXT,
    -- Business address
    address_line1           VARCHAR(255),
    address_line2           VARCHAR(255),
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    postal_code             VARCHAR(20),
    country                 VARCHAR(3)      DEFAULT 'IND',
    -- Platform terms
    commission_rate         NUMERIC(5,2)    NOT NULL DEFAULT 10.00,
    -- Verification
    is_verified             BOOLEAN         NOT NULL DEFAULT FALSE,
    verified_at             TIMESTAMPTZ,
    verified_by             BIGINT,
    -- Denormalized performance metrics (updated by background jobs)
    avg_rating              NUMERIC(3,2)    NOT NULL DEFAULT 0.00,
    total_ratings           INT             NOT NULL DEFAULT 0,
    total_products_listed   INT             NOT NULL DEFAULT 0,
    total_sales_count       INT             NOT NULL DEFAULT 0,
    total_revenue_cents     BIGINT          NOT NULL DEFAULT 0,
    -- Lifecycle
    status                  VARCHAR(20)     NOT NULL DEFAULT 'PENDING_APPROVAL',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_sellers_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT uq_sellers_slug              UNIQUE (slug),
    CONSTRAINT chk_sellers_business_type    CHECK (business_type IN ('INDIVIDUAL', 'COMPANY', 'PARTNERSHIP')),
    CONSTRAINT chk_sellers_commission       CHECK (commission_rate >= 0 AND commission_rate <= 100),
    CONSTRAINT chk_sellers_avg_rating       CHECK (avg_rating >= 0 AND avg_rating <= 5),
    CONSTRAINT chk_sellers_status
        CHECK (status IN ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'REJECTED'))
);

CREATE INDEX idx_sellers_status ON sellers (status);


-- ──────────────────────────────────────────────────────────────────────────
-- seller_bank_accounts: For seller payouts/settlements
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE seller_bank_accounts (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seller_id               BIGINT          NOT NULL,
    account_holder_name     VARCHAR(255)    NOT NULL,
    bank_name               VARCHAR(255)    NOT NULL,
    account_number_masked   VARCHAR(20)     NOT NULL,   -- last 4 digits only, e.g. "XXXX1234"
    account_number_hash     VARCHAR(255)    NOT NULL,   -- for duplicate detection without storing raw
    ifsc_code               VARCHAR(11)     NOT NULL,
    branch_name             VARCHAR(255),
    account_type            VARCHAR(20)     NOT NULL DEFAULT 'SAVINGS',
    is_primary              BOOLEAN         NOT NULL DEFAULT FALSE,
    is_verified             BOOLEAN         NOT NULL DEFAULT FALSE,
    verified_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_seller_bank_seller
        FOREIGN KEY (seller_id) REFERENCES sellers (user_id) ON DELETE RESTRICT,
    CONSTRAINT chk_seller_bank_type
        CHECK (account_type IN ('SAVINGS', 'CURRENT'))
);

CREATE INDEX idx_seller_bank_seller ON seller_bank_accounts (seller_id);
-- Ensure only one primary bank account per seller
CREATE UNIQUE INDEX uq_seller_bank_primary ON seller_bank_accounts (seller_id) WHERE is_primary = TRUE;
