package test

import (
	"os"
	"testing"

	analysis "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/analysis"
)

func TestCountEventTypes(t *testing.T) {
	dir := t.TempDir()
	file := dir + "/events.jsonl"
	data := []byte("{\"type\":\"A\"}\n{\"type\":\"B\"}\n{\"type\":\"A\"}\n")
	if err := os.WriteFile(file, data, 0644); err != nil {
		t.Fatalf("write: %v", err)
	}
	counts, err := analysis.CountEventTypes(file)
	if err != nil {
		t.Fatalf("count: %v", err)
	}
	if counts["A"] != 2 || counts["B"] != 1 {
		t.Fatalf("unexpected counts %v", counts)
	}
}
