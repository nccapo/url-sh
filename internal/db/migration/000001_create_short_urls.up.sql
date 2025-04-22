CREATE TABLE IF NOT EXISTS short_urls (
    id BIGSERIAL PRIMARY KEY,
    iid UUID DEFAULT gen_random_uuid (),
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    base_url TEXT NOT NULL, -- for branded/custom domains
    expiration TIMESTAMP
    WITH
        TIME ZONE,
        redirect_count INT DEFAULT 0,
        last_accessed TIMESTAMP DEFAULT NOW (),
        last_modified TIMESTAMP DEFAULT NOW (),
        method VARCHAR(20) NOT NULL
);
