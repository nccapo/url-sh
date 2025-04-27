// Package server provides the server implementation for the URL shortener service.
package server

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
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
	// UTM Parameters
	UTMSource   string `json:"utm_source,omitempty"`
	UTMMedium   string `json:"utm_medium,omitempty"`
	UTMCampaign string `json:"utm_campaign,omitempty"`
	UTMTerm     string `json:"utm_term,omitempty"`
	UTMContent  string `json:"utm_content,omitempty"`
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
		UTMSource:     req.UTMSource,
		UTMMedium:     req.UTMMedium,
		UTMCampaign:   req.UTMCampaign,
		UTMTerm:       req.UTMTerm,
		UTMContent:    req.UTMContent,
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

	// Build the redirect URL with UTM parameters if they exist
	redirectURL := uResp.OriginalURL
	if uResp.UTMSource != "" || uResp.UTMMedium != "" || uResp.UTMCampaign != "" || uResp.UTMTerm != "" || uResp.UTMContent != "" {
		params := url.Values{}
		if uResp.UTMSource != "" {
			params.Add("utm_source", uResp.UTMSource)
		}
		if uResp.UTMMedium != "" {
			params.Add("utm_medium", uResp.UTMMedium)
		}
		if uResp.UTMCampaign != "" {
			params.Add("utm_campaign", uResp.UTMCampaign)
		}
		if uResp.UTMTerm != "" {
			params.Add("utm_term", uResp.UTMTerm)
		}
		if uResp.UTMContent != "" {
			params.Add("utm_content", uResp.UTMContent)
		}

		// Check if the original URL already has query parameters
		if strings.Contains(redirectURL, "?") {
			redirectURL += "&" + params.Encode()
		} else {
			redirectURL += "?" + params.Encode()
		}
	}

	http.Redirect(w, r, redirectURL, http.StatusFound)
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
