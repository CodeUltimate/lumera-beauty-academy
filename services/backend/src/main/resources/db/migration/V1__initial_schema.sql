-- Luméra Beauty Academy - Initial Database Schema
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'EDUCATOR', 'ADMIN')),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED')),
    email_verified BOOLEAN DEFAULT FALSE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    -- Educator-specific fields
    specialty VARCHAR(200),
    website VARCHAR(500),
    instagram VARCHAR(100),
    educator_verified BOOLEAN DEFAULT FALSE,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    image_url VARCHAR(500),
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_visible ON categories(visible);

-- Live Classes table
CREATE TABLE live_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    max_students INTEGER CHECK (max_students > 0),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
    thumbnail_url VARCHAR(500),
    recording_url VARCHAR(500),
    meeting_url VARCHAR(500),
    meeting_id VARCHAR(100),
    skill_level VARCHAR(20) NOT NULL DEFAULT 'ALL_LEVELS' CHECK (skill_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS')),
    educator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_live_classes_educator ON live_classes(educator_id);
CREATE INDEX idx_live_classes_category ON live_classes(category_id);
CREATE INDEX idx_live_classes_status ON live_classes(status);
CREATE INDEX idx_live_classes_scheduled_at ON live_classes(scheduled_at);

-- Live Class Topics (many-to-many relationship stored as collection)
CREATE TABLE live_class_topics (
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    PRIMARY KEY (live_class_id, topic)
);

-- Live Class Requirements
CREATE TABLE live_class_requirements (
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    requirement VARCHAR(500) NOT NULL,
    PRIMARY KEY (live_class_id, requirement)
);

-- Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL CHECK (amount_paid >= 0),
    platform_fee DECIMAL(10, 2) CHECK (platform_fee >= 0),
    educator_earning DECIMAL(10, 2) CHECK (educator_earning >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'ATTENDED', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
    payment_intent_id VARCHAR(255),
    enrolled_at TIMESTAMP WITH TIME ZONE,
    attended_at TIMESTAMP WITH TIME ZONE,
    attendance_duration_minutes INTEGER,
    certificate_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (student_id, live_class_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_live_class ON enrollments(live_class_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_payment_status ON enrollments(payment_status);

-- Certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    pdf_url VARCHAR(500),
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason TEXT,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_live_class ON certificates(live_class_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);

-- Payout Records table
CREATE TABLE payout_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    educator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    platform_fee_total DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (platform_fee_total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    payout_method VARCHAR(50),
    payout_reference VARCHAR(255),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payout_records_educator ON payout_records(educator_id);
CREATE INDEX idx_payout_records_status ON payout_records(status);

-- Refresh Tokens table for JWT authentication
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_live_classes_updated_at BEFORE UPDATE ON live_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payout_records_updated_at BEFORE UPDATE ON payout_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
