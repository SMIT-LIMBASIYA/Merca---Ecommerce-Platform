-- ============================================================================
-- V001: PostgreSQL Extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- UUID generation for idempotency keys
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- trigram search for product search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- cryptographic functions
