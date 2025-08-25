package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/GenesisAeon/unifiedmandala-go/pkg/codeagent"
)

func parseHandler(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Query().Get("file")
	if file == "" {
		file = "."
	}
	todos, err := codeagent.ParseTODOs(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func main() {
	http.HandleFunc("/usecases/todo/parse", parseHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
