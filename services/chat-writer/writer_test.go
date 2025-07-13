package chatwriter

import (
	"os"
	"testing"
)

func TestAppendMessage(t *testing.T) {
	tmp := "test_messages.json"
	defer os.Remove(tmp)

	msg := Message{ID: "1", Content: "hello", Author: "tester", Time: "now"}
	called := false
	err := AppendMessage(tmp, msg, func(m Message) { called = true })
	if err != nil {
		t.Fatalf("append failed: %v", err)
	}
	if !called {
		t.Fatalf("event hook not called")
	}

	data, err := os.ReadFile(tmp)
	if err != nil {
		t.Fatalf("read failed: %v", err)
	}
	if len(data) == 0 {
		t.Fatalf("no data written")
	}
}
