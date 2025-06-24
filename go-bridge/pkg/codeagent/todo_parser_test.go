package codeagent

import (
	"os"
	"testing"
)

func TestParseTODOs(t *testing.T) {
	tmp := "todo_tmp.txt"
	data := "// TODO: first\ncode\n// TODO second"
	if err := os.WriteFile(tmp, []byte(data), 0644); err != nil {
		t.Fatalf("write: %v", err)
	}
	defer os.Remove(tmp)

	todos, err := ParseTODOs(tmp)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if len(todos) != 2 {
		t.Fatalf("expected 2, got %d", len(todos))
	}
}
