package main

import (
	"fmt"

	"github.com/nccapo/url-sh/config"
	"github.com/nccapo/url-sh/gen"
)

func main() {
	_, err := config.NewConfig(
		config.WithMaxRedirects(10),
		config.WithBaseURL("urls"),
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	shortener := gen.NewShortener("http://localhost:8080")
	shortener.OriginalURL = "https://example.com"

	shortener.Method = gen.Secure
	shortener.GenerateShortURL("")

	fmt.Printf("%+v\n", shortener)
}
