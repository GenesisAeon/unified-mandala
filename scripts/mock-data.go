package main

import (
    "encoding/json"
    "os"
)

// MockData represents sample payload used in tests.
type MockData struct {
    ID          string `json:"id"`
    EventHook   string `json:"eventHook"`
    FractalHash string `json:"fractalHash"`
}

func main() {
    data := MockData{ID: "1", EventHook: "test", FractalHash: "hash"}
    enc := json.NewEncoder(os.Stdout)
    enc.SetIndent("", "  ")
    enc.Encode(data)
}
