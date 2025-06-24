package client

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/GenesisAeon/unifiedmandala-go/pkg/models"
)

func TestGetMetaScores(t *testing.T) {
	expected := []models.MetaScore{{EntryID: "1"}}
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(expected)
	}))
	defer srv.Close()

	cli := NewRestClient(srv.URL, "")
	scores, err := cli.GetMetaScores(context.Background())
	if err != nil {
		t.Fatalf("error: %v", err)
	}
	if len(scores) != 1 || scores[0].EntryID != "1" {
		t.Fatalf("unexpected: %+v", scores)
	}
}

func TestSubscribeCREPError(t *testing.T) {
	if err := SubscribeCREP("nats://127.0.0.1:1", "s"); err == nil {
		t.Fatal("expected error")
	}
}
