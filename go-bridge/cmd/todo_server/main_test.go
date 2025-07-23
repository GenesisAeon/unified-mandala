package main

import (
    "io/ioutil"
    "net/http"
    "net/http/httptest"
    "os"
    "testing"
)

func TestParseHandler(t *testing.T) {
    tmp := "todo_server_tmp.txt"
    os.WriteFile(tmp, []byte("// TODO: server"), 0644)
    defer os.Remove(tmp)

    req, _ := http.NewRequest("GET", "/usecases/todo/parse?file="+tmp, nil)
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
