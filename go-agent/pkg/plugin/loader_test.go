package plugin

import "testing"

func TestLoadFail(t *testing.T) {
	if _, err := Load("nonexistent.so"); err == nil {
		t.Fatal("expected error")
	}
}
