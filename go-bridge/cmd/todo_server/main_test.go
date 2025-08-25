package main

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestParseHandler(t *testing.T) {
	dir := t.TempDir()
	file := filepath.Join(dir, "todo.txt")
	os.WriteFile(file, []byte("// TODO: server"), 0644)
	old, _ := os.Getwd()
	defer os.Chdir(old)
	os.Chdir(dir)

	req, _ := http.NewRequest("GET", "/usecases/todo/parse", nil)
	rr := httptest.NewRecorder()
	parseHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("status %d", rr.Code)
	}
	body, _ := ioutil.ReadAll(rr.Body)
	if string(body) == "" {
		t.Fatalf("empty response")
	}
}
