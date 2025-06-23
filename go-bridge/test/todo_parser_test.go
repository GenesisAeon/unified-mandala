package client_test

import (
    "os"
    "testing"

    "github.com/GenesisAeon/unifiedmandala-go/pkg/codeagent"
)

func TestParseTODOs(t *testing.T) {
    tmp := "./todo_tmp.txt"
    content := "line1\n// TODO: first\ncode\n// TODO second"
    if err := os.WriteFile(tmp, []byte(content), 0644); err != nil {
        t.Fatalf("write tmp: %v", err)
    }
    defer os.Remove(tmp)

    todos, err := codeagent.ParseTODOs(tmp)
    if err != nil {
        t.Fatalf("parse: %v", err)
    }
    if len(todos) != 2 {
        t.Fatalf("expected 2 todos, got %d", len(todos))
    }
}
