package main

import (
	"os"
	"os/exec"
	"strings"
	"testing"
)

func TestTodoParserCLI(t *testing.T) {
	tmp := "todo_cli_tmp.txt"
	os.WriteFile(tmp, []byte("// TODO: cli"), 0644)
	defer os.Remove(tmp)

	cmd := exec.Command("go", "run", "./todo_parser.go", "-file", tmp)
	out, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("run: %v, %s", err, string(out))
	}
	if !strings.Contains(string(out), "cli") {
		t.Fatalf("unexpected %s", string(out))
	}
}
