// Package server provides the server implementation for the URL shortener service.
package server

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/nccapo/url-sh/internal/gen"
	"github.com/nccapo/url-sh/internal/store"
)

var H Handler

type Handler struct {
	Store *store.Store `json:"store"`
}

type URLRequest struct {
	URL    string     `json:"url"`
	Method gen.Method `json:"method"`
	Alias  string     `json:"alias"`
}

func (h *Handler) ShortenURL(w http.ResponseWriter, r *http.Request) {
	var req URLRequest

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	s := gen.NewShortener("http://localhost:8090")
	// Initialize the shortener with the provided method
	s.Method = req.Method
	s.OriginalURL = req.URL
	err := s.GenerateShortURL(req.Alias)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	uResp, err := h.Store.Shortener.Create(r.Context(), &store.URLShortener{
		ShortCode:     s.ShortCode,
		OriginalURL:   req.URL,
		Method:        string(req.Method),
		BaseURL:       "http://localhost:8090",
		RedirectCount: 0,
		LastAccessed:  time.Now(),
		LastModified:  time.Now(),
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create response struct
	response := struct {
		Shortener interface{} `json:"shortener"`
	}{
		Shortener: uResp,
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and send the response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) GetURLStats(w http.ResponseWriter, r *http.Request) {
	code := r.PathValue("code")
	if code == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	uResp, err := h.Store.Shortener.FindWithShortCode(r.Context(), code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create response struct
	response := struct {
		Shortener interface{} `json:"shortener"`
	}{
		Shortener: uResp,
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and send the response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *Handler) UpdateVisitsCount(w http.ResponseWriter, r *http.Request) {
	code := r.PathValue("code")
	if code == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	uResp, err := h.Store.Shortener.FindWithShortCode(r.Context(), code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = h.Store.Shortener.UpdateRedirectCount(r.Context(), uResp.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, uResp.OriginalURL, http.StatusFound)
}

func (h *Handler) FindWithURL(w http.ResponseWriter, r *http.Request) {
	shortURL := r.URL.Query().Get("q")
	if shortURL == "" {
		http.Error(w, "shortURL is required", http.StatusBadRequest)
		return
	}

	uResp, err := h.Store.Shortener.FindWithURL(r.Context(), shortURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create response struct
	response := struct {
		Shortener interface{} `json:"shortener"`
	}{
		Shortener: uResp,
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and send the response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
