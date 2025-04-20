package main

import (
	"fmt"

	"github.com/nccapo/url-sh/config"
)

func main() {
	cfg, err := config.NewConfig(
		config.WithMaxRedirects(10),
		config.WithBaseURL("urls"),
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("%+v\n", cfg)
}
