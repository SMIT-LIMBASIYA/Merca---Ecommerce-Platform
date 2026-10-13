-- ============================================================================
-- V011: User Authentication & Audit History
-- ============================================================================
-- Tracks every login, registration, logout, and security verification attempt.
-- Records device, browser, IP, location/metadata, and outcome.
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_auth_history (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             BIGINT          NOT NULL,
    action_type         VARCHAR(50)     NOT NULL, -- 'LOGIN', 'REGISTER', 'LOGOUT', 'SECRET_PASSWORD_SUCCESS', 'SECRET_PASSWORD_FAILED', 'OTP_VERIFIED'
    status              VARCHAR(20)     NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED'
    ip_address          VARCHAR(45),
    user_agent          TEXT,
    device_type         VARCHAR(50)     DEFAULT 'Desktop',
    browser             VARCHAR(50),
    os                  VARCHAR(50),
    failure_reason      VARCHAR(255),
    metadata            JSONB           DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

    CONSTRAINT fk_auth_history_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT chk_auth_history_status
        CHECK (status IN ('SUCCESS', 'FAILED'))
);

-- Indices for rapid querying by user and time
CREATE INDEX IF NOT EXISTS idx_auth_history_user ON user_auth_history (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_history_action ON user_auth_history (action_type, created_at DESC);
