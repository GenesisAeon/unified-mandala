package gpt

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestProcessLink(t *testing.T) {
	gptSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `{"text":"ok"}`)
	}))
	defer gptSrv.Close()

	pageSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "<p>hello</p>")
	}))
	defer pageSrv.Close()

	c := NewClient(gptSrv.URL, "key")
	res, err := c.ProcessLink(context.Background(), pageSrv.URL)
	if err != nil || res != "ok" {
		t.Fatalf("unexpected %s %v", res, err)
	}
}
