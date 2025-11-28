-- Email Verification Tokens Table
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_verification_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster token lookup
CREATE INDEX idx_verification_token ON email_verification_tokens(token);

-- Index for finding tokens by user
CREATE INDEX idx_verification_token_user ON email_verification_tokens(user_id);

-- Index for cleanup of expired tokens
CREATE INDEX idx_verification_token_expires ON email_verification_tokens(expires_at);
