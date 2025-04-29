// Package store provides an interface for interacting with the database.
package store

import (
	"context"
	"database/sql"
)

// Store represents a store for URL shorteners.
type Store struct {
	Shortener interface {
		Create(ctx context.Context, model *URLShortener) (*URLShortener, error)
		FindWithShortCode(ctx context.Context, shortCode string) (*URLShortener, error)
		UpdateRedirectCount(ctx context.Context, id int) error
		FindWithURL(ctx context.Context, shortURL string) (*URLShortener, error)
	}
	AccessLogs interface {
		CreateLog(ctx context.Context, log *AccessLog) error
		LastAccessed(ctx context.Context, shortCode string) (*AccessLog, error)
		UniqueIPAddresses(ctx context.Context, shortCode string) ([]string, error)
		TopUserAgents(ctx context.Context, shortCode string) ([]string, error)
	}
}

// NewStore creates a new Store instance.
func NewStore(db *sql.DB) Store {
	return Store{
		Shortener:  &PostgresURLShortener{db: db},
		AccessLogs: &PostgresAccessLogs{db: db},
	}
}
