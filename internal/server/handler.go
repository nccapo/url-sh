// Package server provides the server implementation for the URL shortener service.
package server

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type URLRequest struct {
	URL string `json:"url"`
}

func ShortenURL(w http.ResponseWriter, r *http.Request) {
	var req URLRequest
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(req)

	w.WriteHeader(http.StatusOK)
}
