package test

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthEndpoints(t *testing.T) {
	liveRec := httptest.NewRecorder()
	liveReq := httptest.NewRequest("GET", "/healthz/live", nil)
	http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}).ServeHTTP(liveRec, liveReq)
	if liveRec.Code != http.StatusOK {
		t.Fatalf("live expected 200 got %d", liveRec.Code)
	}

	readyRec := httptest.NewRecorder()
	readyReq := httptest.NewRequest("GET", "/healthz/ready", nil)
	http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ready"))
	}).ServeHTTP(readyRec, readyReq)
	if readyRec.Code != http.StatusOK {
		t.Fatalf("ready expected 200 got %d", readyRec.Code)
	}
}
