package test

import (
	"testing"

	core "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/core"
)

func TestNewState(t *testing.T) {
	s := core.NewState(3)
	if len(s.Entities) != 3 {
		t.Fatalf("expected 3 entities, got %d", len(s.Entities))
	}
}
