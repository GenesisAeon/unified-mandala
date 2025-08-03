package codeagent

import "testing"

func TestAgentRun(t *testing.T) {
    a := New("tester")
    got := a.Run("echo")
    if got != "echo" {
        t.Fatalf("expected echo, got %s", got)
    }
}

