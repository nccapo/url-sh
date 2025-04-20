// Package config provides configuration settings for the URL shortener service.
package config

// Option is a function that configures a Config instance.
type Option func(*Config)

// Config represents the configuration settings for the URL shortener service.
type Config struct {
	// DatabaseURL is the URL of the database to use.
	DatabaseURL string `json:"database_url"`

	// Port is the port to listen on.
	Port int `json:"port"`

	// SecretKey is the secret key to use for signing tokens.
	SecretKey string `json:"secret_key"`

	// BaseURL is the base URL of the service.
	BaseURL string `json:"base_url"`

	// MaxURLsPerUser is the maximum number of URLs a user can create.
	MaxURLsPerUser int `json:"max_urls_per_user"`

	// MaxURLLength is the maximum length of a URL.
	MaxURLLength int `json:"max_url_length"`

	// MaxRedirects is the maximum number of redirects allowed.
	MaxRedirects int `json:"max_redirects"`

	// MaxRedirectsPerURL is the maximum number of redirects allowed per URL.
	MaxRedirectsPerURL int `json:"max_redirects_per_url"`

	// MaxRedirectsPerUser is the maximum number of redirects allowed per user.
	MaxRedirectsPerUser int `json:"max_redirects_per_user"`
}

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

// defaultConfig returns a default Config instance.
func defaultConfig() *Config {
	return &Config{
		DatabaseURL:         "postgres://user:password@localhost:5432/url_shortener",
		Port:                8080,
		SecretKey:           "secret_key",
		BaseURL:             "http://localhost:8080",
		MaxURLsPerUser:      100,
		MaxURLLength:        2048,
		MaxRedirects:        10,
		MaxRedirectsPerURL:  5,
		MaxRedirectsPerUser: 5,
	}
}

// NewConfig creates a new Config instance with default values.
func NewConfig(opts ...Option) (*Config, error) {
	c := defaultConfig()

	// Apply all options
	for _, opt := range opts {
		opt(c)
	}

	// validate config
	messages := c.validate()
	if err := PrintValidationMessages(messages); err != nil {
		return nil, err
	}

	return c, nil
}
