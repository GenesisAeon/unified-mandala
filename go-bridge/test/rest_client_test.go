package client_test

import (
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/GenesisAeon/unifiedmandala-go/pkg/client"
    "github.com/GenesisAeon/unifiedmandala-go/pkg/models"
)

func TestGetMetaScores(t *testing.T) {
    expected := []models.MetaScore{{EntryID: "1", CombinedScore: 1.2}}
    srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/api/meta-scores" {
            http.NotFound(w, r)
            return
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(expected)
    }))
    defer srv.Close()

    cli := client.NewRestClient(srv.URL, "token")
    scores, err := cli.GetMetaScores(context.Background())
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if len(scores) != 1 || scores[0].EntryID != "1" {
        t.Fatalf("unexpected scores: %+v", scores)
    }
}
