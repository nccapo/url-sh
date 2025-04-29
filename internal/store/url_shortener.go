package store

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

type URLShortener struct {
	ID            int       `json:"-"`
	IID           uuid.UUID `json:"iid"`
	OriginalURL   string    `json:"original_url"`
	ShortCode     string    `json:"short_code"`
	BaseURL       string    `json:"-"`
	ShortURL      string    `json:"short_url"`
	Expiration    time.Time `json:"expiration"`
	RedirectCount int       `json:"redirect_count"`
	LastAccessed  time.Time `json:"last_accessed"`
	LastModified  time.Time `json:"last_modified"`
	Method        string    `json:"method"`
	// UTM Parameters
	UTMSource   string `json:"utm_source,omitempty"`
	UTMMedium   string `json:"utm_medium,omitempty"`
	UTMCampaign string `json:"utm_campaign,omitempty"`
	UTMTerm     string `json:"utm_term,omitempty"`
	UTMContent  string `json:"utm_content,omitempty"`
}

type PostgresURLShortener struct {
	db *sql.DB
}

// formatShortURL combines base URL with path and ensures proper formatting
func (u *URLShortener) formatShortURL() string {
	// Remove trailing slash from base URL if present
	baseURL := strings.TrimRight(u.BaseURL, "/")
	// Remove leading slash from path if present
	path := strings.TrimLeft(u.ShortCode, "/")
	return fmt.Sprintf("%s/%s", baseURL, path)
}

func (p *PostgresURLShortener) Create(ctx context.Context, model *URLShortener) (*URLShortener, error) {
	query := `INSERT INTO short_urls (
		original_url, short_code, base_url, expiration, redirect_count,
		last_accessed, last_modified, method, utm_source, utm_medium,
		utm_campaign, utm_term, utm_content
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, iid`

	model.BaseURL = model.formatShortURL()
	err := p.db.QueryRowContext(ctx, query,
		model.OriginalURL,
		model.ShortCode,
		model.BaseURL,
		model.Expiration,
		model.RedirectCount,
		model.LastAccessed,
		model.LastModified,
		model.Method,
		model.UTMSource,
		model.UTMMedium,
		model.UTMCampaign,
		model.UTMTerm,
		model.UTMContent,
	).Scan(&model.ID, &model.IID)
	if err != nil {
		return nil, err
	}

	model.ShortURL = model.formatShortURL()

	return model, nil
}

func (p *PostgresURLShortener) FindWithShortCode(ctx context.Context, shortCode string) (*URLShortener, error) {
	query := `SELECT id, iid, original_url, short_code, base_url, expiration,
		redirect_count, last_accessed, last_modified, method, utm_source,
		utm_medium, utm_campaign, utm_term, utm_content
		FROM short_urls WHERE short_code = $1`

	var model URLShortener
	err := p.db.QueryRowContext(ctx, query, shortCode).Scan(
		&model.ID,
		&model.IID,
		&model.OriginalURL,
		&model.ShortCode,
		&model.BaseURL,
		&model.Expiration,
		&model.RedirectCount,
		&model.LastAccessed,
		&model.LastModified,
		&model.Method,
		&model.UTMSource,
		&model.UTMMedium,
		&model.UTMCampaign,
		&model.UTMTerm,
		&model.UTMContent,
	)
	if err != nil {
		return nil, err
	}

	model.ShortURL = model.BaseURL

	return &model, nil
}

func (p *PostgresURLShortener) FindWithURL(ctx context.Context, shortURL string) (*URLShortener, error) {
	query := `SELECT id, iid, original_url, short_code, base_url, expiration,
		redirect_count, last_accessed, last_modified, method, utm_source,
		utm_medium, utm_campaign, utm_term, utm_content
		FROM short_urls WHERE base_url = $1 OR short_code = $1`

	var model URLShortener
	err := p.db.QueryRowContext(ctx, query, shortURL).Scan(
		&model.ID,
		&model.IID,
		&model.OriginalURL,
		&model.ShortCode,
		&model.BaseURL,
		&model.Expiration,
		&model.RedirectCount,
		&model.LastAccessed,
		&model.LastModified,
		&model.Method,
		&model.UTMSource,
		&model.UTMMedium,
		&model.UTMCampaign,
		&model.UTMTerm,
		&model.UTMContent,
	)
	if err != nil {
		return nil, err
	}

	model.ShortURL = model.BaseURL

	return &model, nil
}

func (p *PostgresURLShortener) UpdateRedirectCount(ctx context.Context, id int) error {
	query := `UPDATE short_urls SET redirect_count = redirect_count + 1 WHERE id = $1`

	_, err := p.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	return nil
}
