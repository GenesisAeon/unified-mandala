package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetMetaScores(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("[]"))
	}))
	defer srv.Close()
	if _, err := GetMetaScores(srv.URL); err != nil {
		t.Fatalf("get: %v", err)
	}
}

func TestNewMetaScoreClient(t *testing.T) {
	client, conn, err := NewMetaScoreClient("127.0.0.1:0")
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	conn.Close()
	if client == nil {
		t.Fatal("expected client")
	}
}

func TestSubscribeToCREPEvents(t *testing.T) {
	if err := SubscribeToCREPEvents("nats://127.0.0.1:1", "s"); err == nil {
		t.Fatal("expected error")
	}
}
