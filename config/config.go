// Package config provides configuration settings for the URL shortener service.
package config

import (
	"time"

	"github.com/joho/godotenv"
	"github.com/nccapo/url-sh/internal/store"
)

var (
	maxOpenCons = 30
	maxIdleCons = 30
	idleTime    = time.Minute * 5
)

// Option is a function that configures a Config instance.
type Option func(*Config)

// Config represents the configuration settings for the URL shortener service.
type Config struct {
	// DBConfig is the configuration for the database.
	DBConfig *DBConfig `json:"db"`

	Store *store.Store `json:"store"`

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

// DBConfig is the configuration for the database.
type DBConfig struct {
	Addr         string        `json:"addr"`
	MaxOpenConns int           `json:"max_open_conns"`
	MaxIdleConns int           `json:"max_idle_conns"`
	MaxIdleTime  time.Duration `json:"max_idle_time"`
}

// defaultConfig returns a default Config instance.
func defaultConfig() *Config {
	// Load .env file if it exists
	godotenv.Load()

	return &Config{
		DBConfig: &DBConfig{
			Addr:         getEnvString("DB_ADDRESS", "postgres://user:psw@localhost/db?sslmode=disable"),
			MaxOpenConns: getEnvInt("DB_MAX_OPEN_CONNS", maxOpenCons),
			MaxIdleConns: getEnvInt("DB_MAX_IDLE_CONNS", maxIdleCons),
			MaxIdleTime:  getEnvDuration("DB_MAX_IDLE_TIME", idleTime),
		},
		Port:                getEnvInt("APP_PORT", 8080),
		SecretKey:           getEnvString("APP_SECRET_KEY", "secret_key"),
		BaseURL:             getEnvString("APP_BASE_URL", "http://localhost:8080"),
		MaxURLsPerUser:      getEnvInt("APP_MAX_URLS_PER_USER", 100),
		MaxURLLength:        getEnvInt("APP_MAX_URL_LENGTH", 2048),
		MaxRedirects:        getEnvInt("APP_MAX_REDIRECTS", 10),
		MaxRedirectsPerURL:  getEnvInt("APP_MAX_REDIRECTS_PER_URL", 5),
		MaxRedirectsPerUser: getEnvInt("APP_MAX_REDIRECTS_PER_USER", 5),
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
