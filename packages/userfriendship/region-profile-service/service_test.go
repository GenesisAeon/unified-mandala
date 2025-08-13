package regionprofileservice

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestLookupRegion(t *testing.T) {
    r := LookupRegion("127.0.0.1")
    if r == nil || r.Region != "Berlin" {
        t.Fatalf("expected Berlin, got %#v", r)
    }
}

func TestHandler(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/friendship/region/127.0.0.1", nil)
    w := httptest.NewRecorder()
    Handler(w, req)
    if w.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", w.Code)
    }
    var region Region
    if err := json.NewDecoder(w.Body).Decode(&region); err != nil {
        t.Fatalf("decode error: %v", err)
    }
    if region.Region != "Berlin" {
        t.Fatalf("expected Berlin, got %s", region.Region)
    }
}
