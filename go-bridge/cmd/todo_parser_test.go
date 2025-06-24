package main

import (
	"context"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"testing"
	"time"
)

func TestRunTodoParser(t *testing.T) {
	tmp := "./todo_tmp.txt"
	os.WriteFile(tmp, []byte("// TODO: hi"), 0644)
	defer os.Remove(tmp)
	srv := Run(":8092")
	defer srv.Shutdown(context.Background())
	time.Sleep(100 * time.Millisecond)
	resp, err := http.Get("http://localhost:8092/usecases/todo/parse?file=" + tmp)
	if err != nil {
		t.Fatalf("request: %v", err)
	}
	defer resp.Body.Close()
	b, _ := ioutil.ReadAll(resp.Body)
	if !strings.Contains(string(b), "hi") {
		t.Fatalf("unexpected %s", string(b))
	}
}
