package gpt

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAsk(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"text": "hi"})
	}))
	defer srv.Close()

	c := NewClient(srv.URL, "key")
	txt, err := c.Ask(context.Background(), "hello")
	if err != nil || txt != "hi" {
		t.Fatalf("unexpected result %s %v", txt, err)
	}
}
