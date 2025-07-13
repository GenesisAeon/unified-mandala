package test

import (
	"testing"

	"github.com/GenesisAeon/unified-mandala/universe-sim/pkg/sigil"
)

func TestGenerate(t *testing.T) {
	s := sigil.Generate("run1")
	if len(s) == 0 {
		t.Fatal("empty sigil")
	}
}
