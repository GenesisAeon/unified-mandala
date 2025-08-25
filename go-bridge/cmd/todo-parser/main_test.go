package main

import (
	"context"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestRunTodoParser(t *testing.T) {
	dir := t.TempDir()
	os.WriteFile(filepath.Join(dir, "todo.txt"), []byte("// TODO: hi"), 0644)
	old, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(old)
	srv := Run(":8092")
	defer srv.Shutdown(context.Background())
	time.Sleep(100 * time.Millisecond)
	resp, err := http.Get("http://localhost:8092/usecases/todo/parse")
	if err != nil {
		t.Fatalf("request: %v", err)
	}
	defer resp.Body.Close()
	b, _ := ioutil.ReadAll(resp.Body)
	if !strings.Contains(string(b), "hi") {
		t.Fatalf("unexpected %s", string(b))
	}
}
