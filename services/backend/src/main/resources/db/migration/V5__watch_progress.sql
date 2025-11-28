-- Watch Progress table for tracking student video viewing progress
CREATE TABLE watch_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    live_class_id UUID NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
    watched_seconds INTEGER NOT NULL DEFAULT 0,
    total_duration_seconds INTEGER NOT NULL DEFAULT 0,
    watch_percentage DOUBLE PRECISION NOT NULL DEFAULT 0,
    last_position INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_watched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, live_class_id)
);

CREATE INDEX idx_watch_progress_user ON watch_progress(user_id);
CREATE INDEX idx_watch_progress_live_class ON watch_progress(live_class_id);
CREATE INDEX idx_watch_progress_completed ON watch_progress(completed);

-- Apply update trigger
CREATE TRIGGER update_watch_progress_updated_at
    BEFORE UPDATE ON watch_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
