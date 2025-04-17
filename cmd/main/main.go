package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/C0d3-5t3w/forFun/cmd/api"
	"github.com/C0d3-5t3w/forFun/internal/config"
)

func main() {

	err := api.InitAPI()
	if err != nil {
		log.Fatalf("Failed to initialize API: %v", err)
	}

	log.Println("API initialized successfully")

	api.SetupRoutes()
	log.Println("API routes configured")

	fs := http.FileServer(http.Dir("."))

	var addr string
	cfg := config.Get()
	if cfg.Server.Host != "" && cfg.Server.Port != 0 {
		addr = fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	} else {
		fmt.Println("Type an address to serve from (E.g. 127.0.0.1:8080):")
		fmt.Scanln(&addr)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Clean(r.URL.Path)
		if path == "/" {
			http.ServeFile(w, r, "Index.html")
			return
		}
		if strings.HasPrefix(path, "/pkg/sites/") {
			http.ServeFile(w, r, path[1:])
			return
		}
		fs.ServeHTTP(w, r)
	})

	log.Printf("Server starting on %s", addr)
	log.Println("Chat API available at http://" + addr + "/api/messages")
	err = http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}
