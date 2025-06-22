package test

import (
    "os"
    "testing"

    "github.com/unified-mandala/go-agent/internal/watchers"
)

func TestAdvancedTodoWatcher(t *testing.T) {
    f, err := os.CreateTemp("", "todo")
    if err != nil {
        t.Fatal(err)
    }
    defer os.Remove(f.Name())

    w := watchers.NewAdvancedTodoWatcher(f.Name())
    w.Check()

    if _, err := f.WriteString("task"); err != nil {
        t.Fatal(err)
    }
    f.Close()
    w.Check()
}
