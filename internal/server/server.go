// Package server provides a handler for the URL shortener service.
package server

import (
	"net/http"

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

	return mux
}
