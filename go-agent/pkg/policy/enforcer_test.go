package policy

import "testing"

func TestEnforcer(t *testing.T) {
	e := New(map[string]bool{"op": true})
	if err := e.Check("op"); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if err := e.Check("nope"); err == nil {
		t.Fatal("expected error")
	}
}
