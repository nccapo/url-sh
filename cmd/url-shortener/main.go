package main

import (
	"flag"
	"net/http"

	"github.com/nccapo/url-sh/config"
	"github.com/nccapo/url-sh/internal/db"
	"github.com/nccapo/url-sh/internal/server"
	"github.com/nccapo/url-sh/internal/store"
)

func main() {
	flag.Parse()

	flag.Bool("debug", false, "Enable debug mode")

	// initialize application configuration whith default values.
	cfg, err := config.NewConfig()
	if err != nil {
		panic(err)
	}

	dbConn, err := db.NewConn(cfg.DBConfig.Addr, cfg.DBConfig.MaxOpenConns, cfg.DBConfig.MaxIdleConns, cfg.DBConfig.MaxIdleTime)
	if err != nil {
		panic(err)
	}
	defer dbConn.Close()

	st := store.NewStore(dbConn)

	cfg.Store = &st

	srv := http.Server{
		Addr:    ":8090",
		Handler: server.CorsMiddleware(server.Routes(&st)),
	}

	config.Info("Server started on port :8090")
	config.Info("Press Ctrl+C to stop the server")

	err = srv.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
