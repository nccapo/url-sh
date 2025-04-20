package main

import (
	"flag"
	"net/http"

	"github.com/nccapo/url-sh/config"
	"github.com/nccapo/url-sh/internal/server"
)

func main() {
	flag.Parse()

	flag.Bool("debug", false, "Enable debug mode")

	_, err := config.NewConfig()
	if err != nil {
		panic(err)
	}

	srv := http.Server{
		Addr:    ":8090",
		Handler: server.CorsMiddleware(server.Routes()),
	}

	config.Info("Server started on port 8090")
	config.Info("Press Ctrl+C to stop the server")

	err = srv.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
