// Package store provides an interface for interacting with the database.
package store

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type AccessLog struct {
	ID         int64     `json:"-"`
	IID        uuid.UUID `json:"id"`
	ShortURLID int64     `json:"short_url_id"`
	AccessedAt time.Time `json:"accessed_at"`
	UserAgent  string    `json:"user_agent"`
	IPAddress  string    `json:"ip_address"`
}

type PostgresAccessLogs struct {
	db *sql.DB
}

func (p *PostgresAccessLogs) CreateLog(ctx context.Context, log *AccessLog) error {
	query := `INSERT INTO access_logs (short_url_id, accessed_at, user_agent, ip_address) VALUES ($1, $2, $3, $4)`

	_, err := p.db.ExecContext(ctx, query, log.ShortURLID, log.AccessedAt, log.UserAgent, log.IPAddress)
	if err != nil {
		return err
	}

	return nil
}

func (p *PostgresAccessLogs) LastAccessed(ctx context.Context, shortCode string) (*AccessLog, error) {
	var log AccessLog

	query := `SELECT access_logs.id, access_logs.iid, access_logs.short_url_id, access_logs.accessed_at, access_logs.user_agent, access_logs.ip_address FROM access_logs
	JOIN short_urls ON short_urls.id = access_logs.short_url_id
	WHERE short_urls.short_code = $1
	ORDER BY accessed_at DESC LIMIT 1`

	err := p.db.QueryRowContext(ctx, query, shortCode).
		Scan(&log.ID, &log.IID, &log.ShortURLID, &log.AccessedAt, &log.UserAgent, &log.IPAddress)
	if err != nil {
		return nil, err
	}

	return &log, nil
}

func (p *PostgresAccessLogs) UniqueIPAddresses(ctx context.Context, shortCode string) ([]string, error) {
	query := `SELECT DISTINCT ip_address FROM access_logs
	JOIN short_urls ON short_urls.id = access_logs.short_url_id
	WHERE short_urls.short_code = $1`

	rows, err := p.db.QueryContext(ctx, query, shortCode)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ipAddresses []string
	for rows.Next() {
		var ipAddress string
		if err := rows.Scan(&ipAddress); err != nil {
			return nil, err
		}
		ipAddresses = append(ipAddresses, ipAddress)
	}

	return ipAddresses, nil
}

func (p *PostgresAccessLogs) TopUserAgents(ctx context.Context, shortCode string) ([]string, error) {
	query := `SELECT user_agent FROM access_logs
	JOIN short_urls ON short_urls.id = access_logs.short_url_id
	WHERE short_urls.short_code = $1
	GROUP BY user_agent
	ORDER BY COUNT(*) DESC LIMIT $2`

	rows, err := p.db.QueryContext(ctx, query, shortCode, 5)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var userAgents []string
	for rows.Next() {
		var userAgent string
		if err := rows.Scan(&userAgent); err != nil {
			return nil, err
		}
		userAgents = append(userAgents, userAgent)
	}

	return userAgents, nil
}
