package test

import (
    "net/http"
    "net/http/httptest"
    "encoding/json"
    "sort"
    "testing"

    "github.com/unified-mandala/go-agent/pkg/plugin"
)

func TestRankTasks(t *testing.T) {
    // mock ML service
    srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        var in []plugin.TaskInput
        if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
            t.Fatal(err)
        }
        // simple sort by score descending
        sort.Slice(in, func(i, j int) bool { return in[i].Score > in[j].Score })
        json.NewEncoder(w).Encode(in)
    }))
    defer srv.Close()

    plugin.MLServiceURL = srv.URL
    tasks := []plugin.TaskInput{{ID: "a", Score: 1}, {ID: "b", Score: 2}}
    ranked, err := plugin.RankTasks(tasks)
    if err != nil {
        t.Fatal(err)
    }
    if ranked[0].ID != "b" {
        t.Fatalf("expected b first, got %s", ranked[0].ID)
    }
}
