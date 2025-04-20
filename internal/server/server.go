// Package server provides a handler for the URL shortener service.
package server

import (
	"net/http"
)

// NewServer creates a new server instance.
func Routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /v1/shorten", ShortenURL)
	return mux
}
