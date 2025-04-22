// Package gen contains code generation utilities for the URL Shortener service.
package gen

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"math/big"
	"strings"
	"time"

	"github.com/google/uuid"
)

// Method type is used to identify which strategy is used to generate the short URL.
type Method string

const (
	// Custom method generates a custom short URL.
	Custom Method = "CUSTOM"
	// Random method generates a random short URL.
	Random Method = "RANDOM"
	// Hash method generates a hash-based short URL.
	Hash Method = "HASH"
	// Secure method generates a secure short URL.
	Secure Method = "SECURE"
)

const (
	// Base62 characters for random string generation
	base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	// Default length for random short URLs
	defaultRandomLength = 8
	// Length for hash-based short URLs
	hashLength = 8
	// AES key size in bytes (32 bytes for AES-256)
	keySize = 32
)

// Shortener provides basic setup and functionality for the URL Shortener.
type Shortener struct {
	// ID is the unique identifier for the short URL.
	ID uuid.UUID
	// OriginalURL is the original URL to be shortened.
	OriginalURL string
	// ShortURL is the shortened URL.
	ShortURL string
	// ShortCode is the unique code for the short URL.
	ShortCode string
	// BaseURL is the domain for shortened URLs
	BaseURL string
	// Expiration is the expiration time for the short URL.
	Expiration time.Time
	// RedirectCount is the number of times the short URL has been redirected.
	RedirectCount int
	// LastAccessed is the last time the short URL was accessed.
	LastAccessed time.Time
	// LastModified is the last time the short URL was modified.
	LastModified time.Time
	// Method type is used to identify which strategy is used to generate the short URL.
	Method Method
}

// NewShortener creates a new Shortener instance.
func NewShortener(baseURL string) *Shortener {
	return &Shortener{
		ID:           uuid.New(), // generate a new UUID
		BaseURL:      baseURL,
		Expiration:   time.Now().Add(time.Hour * 24),
		LastAccessed: time.Now(),
		LastModified: time.Now(),
		Method:       Random, // Default method is Random
	}
}

// GenerateShortURL generates a short URL based on the specified method
func (s *Shortener) GenerateShortURL(customAlias string) error {
	var short string
	var err error

	switch s.Method {
	case Custom:
		if customAlias == "" {
			return errors.New("custom alias cannot be empty")
		}
		short = customAlias

	case Random:
		short, err = generateRandomString(defaultRandomLength)
		if err != nil {
			return err
		}

	case Hash:
		short = generateHashBasedURL(s.OriginalURL)

	case Secure:
		short, err = generateSecureURL(s.OriginalURL)
		if err != nil {
			return err
		}

	default:
		return errors.New("invalid shortening method")
	}

	// Combine base URL with generated path
	s.ShortCode = short
	s.ShortURL = formatShortURL(s.BaseURL, short)
	return nil
}

// generateRandomString generates a random Base62 string of specified length
func generateRandomString(length int) (string, error) {
	var result strings.Builder
	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(base62Chars))))
		if err != nil {
			return "", err
		}
		result.WriteByte(base62Chars[n.Int64()])
	}
	return result.String(), nil
}

// generateHashBasedURL generates a SHA-256 hash and truncates it
func generateHashBasedURL(url string) string {
	hasher := sha256.New()
	hasher.Write([]byte(url))
	hash := base64.URLEncoding.EncodeToString(hasher.Sum(nil))
	// Truncate to desired length
	if len(hash) > hashLength {
		hash = hash[:hashLength]
	}
	return hash
}

// generateSecureURL encrypts the URL using AES-256 and encodes it
func generateSecureURL(url string) (string, error) {
	// Generate a random AES-256 key
	key := make([]byte, keySize)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return "", err
	}

	// Create cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Create GCM cipher mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Generate nonce
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Encrypt and encode
	ciphertext := gcm.Seal(nonce, nonce, []byte(url), nil)
	encoded := base64.URLEncoding.EncodeToString(ciphertext)

	// Truncate the encoded string to make it shorter
	if len(encoded) > 12 {
		encoded = encoded[:12]
	}

	return encoded, nil
}

// formatShortURL combines base URL with path and ensures proper formatting
func formatShortURL(baseURL, path string) string {
	// Remove trailing slash from base URL if present
	baseURL = strings.TrimRight(baseURL, "/")
	// Remove leading slash from path if present
	path = strings.TrimLeft(path, "/")
	return fmt.Sprintf("%s/%s", baseURL, path)
}
