-- ============================================================================
-- V007: Payments — payments, payment_attempts
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- payments: Financial obligation per order
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE payments (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id            BIGINT          NOT NULL,
    -- Amounts
    amount_cents        BIGINT          NOT NULL,
    currency            VARCHAR(3)      NOT NULL DEFAULT 'INR',
    -- Method
    method              VARCHAR(30),
    -- Refund tracking
    refund_amount_cents BIGINT,
    refund_reason       TEXT,
    refunded_at         TIMESTAMPTZ,
    -- Timestamps
    paid_at             TIMESTAMPTZ,
    -- Context
    billing_email       VARCHAR(255),
    ip_address          VARCHAR(45),
    -- Flexible gateway metadata
    metadata            JSONB,
    -- Status
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
    CONSTRAINT chk_payments_amount          CHECK (amount_cents > 0),
    CONSTRAINT chk_payments_refund          CHECK (refund_amount_cents IS NULL OR refund_amount_cents > 0),
    CONSTRAINT chk_payments_status
        CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
    CONSTRAINT chk_payments_method
        CHECK (method IS NULL OR method IN ('UPI', 'CARD', 'NET_BANKING', 'WALLET', 'COD', 'EMI'))
);

CREATE INDEX idx_payments_order ON payments (order_id);
CREATE INDEX idx_payments_processing
    ON payments (updated_at)
    WHERE status = 'PROCESSING';
CREATE INDEX idx_payments_status ON payments (status, created_at)
    WHERE status NOT IN ('SUCCESS', 'CANCELLED');


-- ──────────────────────────────────────────────────────────────────────────
-- payment_attempts: Individual gateway interaction records
--
-- Each attempt has its own idempotency_key to prevent double-charging.
-- Multiple attempts can exist for a single payment (retry after failure).
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE payment_attempts (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    payment_id              BIGINT          NOT NULL,
    idempotency_key         UUID            NOT NULL,
    -- Gateway details
    gateway_name            VARCHAR(50)     NOT NULL,
    gateway_reference       VARCHAR(255),
    gateway_order_id        VARCHAR(255),
    gateway_status          VARCHAR(100),
    gateway_response_code   VARCHAR(50),
    gateway_error_code      VARCHAR(100),
    -- Amount
    amount_cents            BIGINT          NOT NULL,
    currency                VARCHAR(3)      NOT NULL DEFAULT 'INR',
    -- Attempt info
    attempt_number          SMALLINT        NOT NULL DEFAULT 1,
    failure_reason          TEXT,
    -- Context
    ip_address              VARCHAR(45),
    user_agent              TEXT,
    request_id              VARCHAR(255),       -- internal request correlation ID
    -- Flexible metadata (gateway-specific response fields)
    metadata                JSONB,
    -- Status
    status                  VARCHAR(20)     NOT NULL DEFAULT 'INITIATED',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT now(),
    responded_at            TIMESTAMPTZ,

    CONSTRAINT fk_pa_payment
        FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE RESTRICT,
    CONSTRAINT uq_pa_idempotency            UNIQUE (idempotency_key),
    CONSTRAINT chk_pa_amount                CHECK (amount_cents > 0),
    CONSTRAINT chk_pa_attempt_number        CHECK (attempt_number > 0),
    CONSTRAINT chk_pa_status
        CHECK (status IN ('INITIATED', 'SENT_TO_GATEWAY', 'SUCCESS', 'FAILED', 'TIMED_OUT', 'CANCELLED'))
);

CREATE INDEX idx_pa_payment_attempt ON payment_attempts (payment_id, attempt_number);
-- Reconciliation: find stuck attempts
CREATE INDEX idx_pa_sent_to_gateway
    ON payment_attempts (created_at)
    WHERE status = 'SENT_TO_GATEWAY';
-- Gateway reference lookup (for webhook processing)
CREATE INDEX idx_pa_gateway_ref ON payment_attempts (gateway_reference)
    WHERE gateway_reference IS NOT NULL;
