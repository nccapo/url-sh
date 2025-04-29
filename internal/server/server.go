// Package server provides a handler for the URL shortener service.
package server

import (
	"net"
	"net/http"
	"strings"

	"github.com/nccapo/url-sh/internal/store"
)

// Routes creates and returns a new ServeMux with all routes configured.
func Routes(st *store.Store) *http.ServeMux {
	mux := http.NewServeMux()

	// Initialize the handler with the store
	H.Store = st

	mux.HandleFunc("POST /v1/shorten", H.ShortenURL)
	mux.HandleFunc("GET /v1/shorten/{code}", H.GetURLStats)
	mux.HandleFunc("PUT /v1/shorten/{code}", H.UpdateVisitsCount)
	mux.HandleFunc("GET /v1/shorten/find", H.FindWithURL)
	mux.HandleFunc("GET /{code}", H.UpdateVisitsCount)

	mux.HandleFunc("GET /v1/shorten/last", H.LastAccessed)
	mux.HandleFunc("GET /v1/shorten/top-agents", H.TopUserAgents)
	mux.HandleFunc("GET /v1/shorten/ips", H.UniqueIPs)

	return mux
}

func getIPAddress(r *http.Request) string {
	// Check for X-Forwarded-For header first
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		ips := strings.Split(forwarded, ",")
		return strings.TrimSpace(ips[0]) // first IP is the client
	}

	// Then check X-Real-IP
	realIP := r.Header.Get("X-Real-Ip")
	if realIP != "" {
		return realIP
	}

	// Fall back to RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
