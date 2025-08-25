package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"

	"github.com/GenesisAeon/unifiedmandala-go/pkg/codeagent"
)

func Run(addr string) *http.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("/usecases/todo/parse", func(w http.ResponseWriter, r *http.Request) {
		file := r.URL.Query().Get("file")
		if file == "" {
			file = "."
		}
		todos, err := codeagent.ParseTODOs(file)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(todos)
	})
	srv := &http.Server{Addr: addr, Handler: mux}
	go func() { _ = srv.ListenAndServe() }()
	return srv
}

func main() {
	addr := flag.String("addr", ":8090", "listen address")
	flag.Parse()
	srv := Run(*addr)
	log.Fatal(srv.ListenAndServe())
}
