package stylevariant

import "testing"

func TestVariant(t *testing.T) {
	if v := Variant("DE"); v != "Hallo" {
		t.Fatalf("expected Hallo, got %s", v)
	}
	if v := Variant("FR"); v != "Bonjour" {
		t.Fatalf("expected Bonjour, got %s", v)
	}
}
