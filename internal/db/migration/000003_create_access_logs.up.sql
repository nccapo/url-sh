CREATE TABLE IF NOT EXISTS access_logs (
    id BIGSERIAL PRIMARY KEY,
    iid UUID DEFAULT gen_random_uuid (),
    short_url_id INTEGER NOT NULL,
    accessed_at TIMESTAMP DEFAULT NOW (),
    user_agent TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    FOREIGN KEY (short_url_id) REFERENCES short_urls (id)
);
