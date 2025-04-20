// Package config provides configuration settings for the URL shortener service.
package config

// GetDatabaseURL returns the database URL
func (c *Config) GetDatabaseURL() string {
	return c.DatabaseURL
}

// GetPort returns the port
func (c *Config) GetPort() int {
	return c.Port
}

// GetSecretKey returns the secret key
func (c *Config) GetSecretKey() string {
	return c.SecretKey
}

// GetBaseURL returns the base URL
func (c *Config) GetBaseURL() string {
	return c.BaseURL
}

// GetMaxURLsPerUser returns the max URLs per user
func (c *Config) GetMaxURLsPerUser() int {
	return c.MaxURLsPerUser
}

// GetMaxURLLength returns the max URL length
func (c *Config) GetMaxURLLength() int {
	return c.MaxURLLength
}

// GetMaxRedirects returns the max redirects allowed
func (c *Config) GetMaxRedirects() int {
	return c.MaxRedirects
}

// GetMaxRedirectsPerURL returns the max redirects per URL
func (c *Config) GetMaxRedirectsPerURL() int {
	return c.MaxRedirectsPerURL
}

// GetMaxRedirectsPerUser returns the max redirects per user
func (c *Config) GetMaxRedirectsPerUser() int {
	return c.MaxRedirectsPerUser
}

// WithDatabaseURL configures the database URL.
func WithDatabaseURL(url string) Option {
	return func(c *Config) {
		c.DatabaseURL = url
	}
}

// WithPort configures the port.
func WithPort(port int) Option {
	return func(c *Config) {
		c.Port = port
	}
}

// WithSecretKey configures the secret key.
func WithSecretKey(key string) Option {
	return func(c *Config) {
		c.SecretKey = key
	}
}

// WithBaseURL configures the base URL.
func WithBaseURL(url string) Option {
	return func(c *Config) {
		c.BaseURL = url
	}
}

// WithMaxRedirects configures the maximum number of redirects allowed.
func WithMaxRedirects(maxRedirects int) Option {
	return func(c *Config) {
		c.MaxRedirects = maxRedirects
	}
}

// WithMaxRedirectsPerURL configures the maximum number of redirects allowed per URL.
func WithMaxRedirectsPerURL(maxRedirectsPerURL int) Option {
	return func(c *Config) {
		c.MaxRedirectsPerURL = maxRedirectsPerURL
	}
}

// WithMaxRedirectsPerUser configures the maximum number of redirects allowed per user.
func WithMaxRedirectsPerUser(maxRedirectsPerUser int) Option {
	return func(c *Config) {
		c.MaxRedirectsPerUser = maxRedirectsPerUser
	}
}
