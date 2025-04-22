// Package config provides configuration settings for the URL shortener service.
package config

import (
	"strings"
)

var (
	MAX_URL_PER_USER       = 10000
	MAX_URL_LENGTH         = 2048
	MAX_REDIRECTS          = 100
	MAX_REDIRECTS_PER_URL  = 10
	MAX_REDIRECTS_PER_USER = 100
)

// validate config fields
// validate config fields and return slice of messages
func (c *Config) validate() []ConfigMessage {
	var messages []ConfigMessage

	// Database URL validation
	if c.DBConfig.Addr == "" {
		messages = append(messages, newConfigMessage(ERROR, "database URL is required"))
	}

	// Port validation
	if c.Port <= 0 || c.Port > 65535 {
		messages = append(messages, newConfigMessage(ERROR, "port must be between 1 and 65535"))
	}

	// Secret key validation
	if c.SecretKey == "" {
		messages = append(messages, newConfigMessage(ERROR, "secret key is required"))
	} else if len(c.SecretKey) < 32 {
		messages = append(messages, newConfigMessage(WARN, "secret key should be at least 32 characters long for better security"))
	}

	// Base URL validation
	if c.BaseURL == "" {
		messages = append(messages, newConfigMessage(ERROR, "base URL is required"))
	} else if !strings.HasPrefix(c.BaseURL, "https://") {
		messages = append(messages, newConfigMessage(WARN, "using non-HTTPS base URL is not recommended in production"))
	}

	// Limits validation
	messages = append(messages, c.validateLimits()...)

	return messages
}

func (c *Config) validateLimits() []ConfigMessage {
	var messages []ConfigMessage

	// MaxURLsPerUser validation
	if c.MaxURLsPerUser <= 0 {
		messages = append(messages, newConfigMessage(ERROR, "max URLs per user must be greater than 0"))
	} else if c.MaxURLsPerUser > MAX_URL_PER_USER {
		messages = append(messages, newConfigMessage(WARN, "max URLs per user (%d) is very high, consider reducing it", c.MaxURLsPerUser))
	}

	// MaxURLLength validation
	if c.MaxURLLength <= 0 {
		messages = append(messages, newConfigMessage(ERROR, "max URL length must be greater than 0"))
	} else if c.MaxURLLength > MAX_URL_LENGTH {
		messages = append(messages, newConfigMessage(WARN, "max URL length (%d) exceeds recommended limit of 2048 characters", c.MaxURLLength))
	}

	// MaxRedirects validation
	if c.MaxRedirects <= 0 {
		messages = append(messages, newConfigMessage(ERROR, "max redirects must be greater than 0"))
	} else if c.MaxRedirects > MAX_REDIRECTS {
		messages = append(messages, newConfigMessage(WARN, "max redirects (%d) is very high, might impact performance", c.MaxRedirects))
	}

	return messages
}
