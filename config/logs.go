// Package config provides configuration options for the URL shortener service.
package config

import (
	"fmt"
)

// LogLevel represents the log level for the URL shortener service.
type LogLevel int

const (
	INFO LogLevel = iota
	WARN
	ERROR
)

// ConfigMessage represents a configuration validation message
type ConfigMessage struct {
	Level   LogLevel
	Message string
}

func newConfigMessage(level LogLevel, format string, args ...interface{}) ConfigMessage {
	return ConfigMessage{
		Level:   level,
		Message: fmt.Sprintf(format, args...),
	}
}

// PrintValidationMessages prints all validation messages with appropriate logging levels
func PrintValidationMessages(messages []ConfigMessage) error {
	hasErrors := false

	for _, msg := range messages {
		switch msg.Level {
		case INFO:
			Info(msg.Message)
		case WARN:
			Warn(msg.Message)
		case ERROR:
			Error(msg.Message)
			hasErrors = true
		}
	}

	if hasErrors {
		return fmt.Errorf("configuration validation failed")
	}
	return nil
}

// Info logs an informational message
func Info(format string, args ...interface{}) {
	fmt.Printf("\033[34mINFO:\033[0m %s\n", fmt.Sprintf(format, args...)) // Blue color for INFO
}

// Warn logs a warning message
func Warn(format string, args ...interface{}) {
	fmt.Printf("\033[33mWARN:\033[0m %s\n", fmt.Sprintf(format, args...)) // Yellow color for WARN
}

// Error logs an error message
func Error(format string, args ...interface{}) {
	fmt.Printf("\033[31mERROR:\033[0m %s\n", fmt.Sprintf(format, args...)) // Red color for ERROR
}
