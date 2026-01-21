-- PropTrade Pro - PostgreSQL Database Schema
-- Generated: 2024-01-21

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE account_phase AS ENUM ('challenge_1', 'challenge_2', 'funded', 'breached', 'completed');
CREATE TYPE account_status AS ENUM ('active', 'paused', 'breached', 'completed');
CREATE TYPE account_type AS ENUM ('standard', 'express', 'scaling');
CREATE TYPE trade_direction AS ENUM ('buy', 'sell');
CREATE TYPE trade_status AS ENUM ('open', 'closed');
CREATE TYPE violation_type AS ENUM ('max_drawdown', 'daily_drawdown', 'rule_violation', 'suspicious_activity');
CREATE TYPE violation_severity AS ENUM ('warning', 'critical');
CREATE TYPE violation_status AS ENUM ('pending', 'reviewed', 'resolved');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
CREATE TYPE payout_method AS ENUM ('bank', 'crypto', 'paypal');

-- ============================================
-- USERS
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url VARCHAR(500),
    status user_status DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- CHALLENGE RULES
-- ============================================

CREATE TABLE challenge_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type account_type UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    account_size DECIMAL(15,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    profit_target DECIMAL(5,2) NOT NULL,
    max_drawdown DECIMAL(5,2) NOT NULL,
    daily_drawdown DECIMAL(5,2) NOT NULL,
    min_trading_days INTEGER DEFAULT 5,
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ACCOUNTS
-- ============================================

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    type account_type NOT NULL,
    phase account_phase DEFAULT 'challenge_1',
    status account_status DEFAULT 'active',
    
    -- Balance information
    starting_balance DECIMAL(15,2) NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    equity DECIMAL(15,2) NOT NULL DEFAULT 0,
    margin DECIMAL(15,2) NOT NULL DEFAULT 0,
    free_margin DECIMAL(15,2) NOT NULL DEFAULT 0,
    
    -- Profit targets
    profit DECIMAL(15,2) NOT NULL DEFAULT 0,
    profit_target DECIMAL(15,2) NOT NULL,
    profit_percentage DECIMAL(8,4) NOT NULL DEFAULT 0,
    
    -- Drawdown limits
    max_drawdown DECIMAL(5,2) NOT NULL,
    daily_drawdown DECIMAL(5,2) NOT NULL,
    current_drawdown DECIMAL(8,4) NOT NULL DEFAULT 0,
    max_drawdown_used DECIMAL(8,4) NOT NULL DEFAULT 0,
    daily_drawdown_used DECIMAL(8,4) NOT NULL DEFAULT 0,
    
    -- Timestamps
    challenge_started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    challenge_ended_at TIMESTAMP WITH TIME ZONE,
    breached_at TIMESTAMP WITH TIME ZONE,
    funded_at TIMESTAMP WITH TIME ZONE,
    
    -- Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_phase ON accounts(phase);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_accounts_created_at ON accounts(created_at DESC);

-- ============================================
-- TRADES
-- ============================================

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    mt4_ticket VARCHAR(50),
    symbol VARCHAR(20) NOT NULL,
    direction trade_direction NOT NULL,
    volume DECIMAL(15,5) NOT NULL,
    entry_price DECIMAL(15,5) NOT NULL,
    exit_price DECIMAL(15,5),
    entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_time TIMESTAMP WITH TIME ZONE,
    pnl DECIMAL(15,2) NOT NULL DEFAULT 0,
    pnl_percentage DECIMAL(8,4) NOT NULL DEFAULT 0,
    swap DECIMAL(15,2) NOT NULL DEFAULT 0,
    commission DECIMAL(15,2) NOT NULL DEFAULT 0,
    duration_minutes INTEGER,
    status trade_status DEFAULT 'open',
    tp_level DECIMAL(15,5),
    sl_level DECIMAL(15,5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trades_account_id ON trades(account_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_entry_time ON trades(entry_time DESC);
CREATE INDEX idx_trades_exit_time ON trades.exit_time DESC);

-- ============================================
-- ACCOUNT VIOLATIONS
-- ============================================

CREATE TABLE account_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type violation_type NOT NULL,
    severity violation_severity NOT NULL,
    description TEXT NOT NULL,
    details JSONB,
    status violation_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT
);

CREATE INDEX idx_violations_account_id ON account_violations(account_id);
CREATE INDEX idx_violations_status ON account_violations(status);
CREATE INDEX idx_violations_type ON account_violations(type);
CREATE INDEX idx_violations_created_at ON account_violations(created_at DESC);

-- ============================================
-- PHASE CHANGE LOG
-- ============================================

CREATE TABLE phase_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    from_phase account_phase NOT NULL,
    to_phase account_phase NOT NULL,
    reason TEXT NOT NULL,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_phase_changes_account_id ON phase_changes(account_id);
CREATE INDEX idx_phase_changes_created_at ON phase_changes(created_at DESC);

-- ============================================
-- PAYOUTS
-- ============================================

CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    method payout_method NOT NULL,
    status payout_status DEFAULT 'pending',
    wallet_address VARCHAR(255),
    bank_account_last4 VARCHAR(4),
    transaction_id VARCHAR(255),
    request_notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_requested_at ON payouts(requested_at DESC);

-- ============================================
-- AUTHENTICATION
-- ============================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(50),
    user_agent TEXT
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- INITIAL DATA (Default Rules)
-- ============================================

INSERT INTO challenge_rules (type, name, description, account_size, price, profit_target, max_drawdown, daily_drawdown, min_trading_days, duration_days) VALUES
('standard', 'Standard Challenge', 'Our most popular challenge with balanced requirements', 25000.00, 99.00, 8.00, 10.00, 5.00, 5, 30),
('express', 'Express Challenge', 'Fast-tracked evaluation for experienced traders', 25000.00, 149.00, 8.00, 10.00, 5.00, 3, 14),
('scaling', 'Scaling Challenge', 'For traders ready to manage larger capital', 100000.00, 399.00, 10.00, 10.00, 5.00, 10, 60);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_challenge_rules_updated_at BEFORE UPDATE ON challenge_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate account number trigger
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.account_number IS NULL THEN
        NEW.account_number := 'PTP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || 
            LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_account_number_trigger BEFORE INSERT ON accounts
    FOR EACH ROW EXECUTE FUNCTION generate_account_number();
