package test

import (
	"testing"

	core "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/core"
)

func TestStateStep(t *testing.T) {
	s := core.NewState(1)
	s.Entities[0].Velocity = core.Vector{X: 1, Y: 2}
	s.Step()
	if s.Entities[0].Position.X != 1 || s.Entities[0].Position.Y != 2 {
		t.Fatalf("unexpected position %+v", s.Entities[0].Position)
	}
}

func TestApplyGravity(t *testing.T) {
	s := core.NewState(1)
	core.ApplyGravity(s, 0.5)
	if s.Entities[0].Velocity.Y != -0.5 {
		t.Fatalf("gravity not applied: %+v", s.Entities[0].Velocity)
	}
}
