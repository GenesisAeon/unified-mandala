package models

import "testing"

func TestSigillin(t *testing.T) {
	s := Sigillin{ID: "1", Content: "c"}
	if s.ID != "1" || s.Content != "c" {
		t.Fatal("mismatch")
	}
}
