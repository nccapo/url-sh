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
