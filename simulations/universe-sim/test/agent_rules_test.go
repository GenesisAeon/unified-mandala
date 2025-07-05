package test

import (
	"testing"

	agent "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/agent"
	core "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/core"
)

func TestMoveAgent(t *testing.T) {
	s := core.NewState(1)
	s.Entities[0].Velocity = core.Vector{X: 0, Y: 0}
	eng := agent.NewEngine(agent.MoveAgent{VX: 1, VY: -1})
	events := eng.Step(s)
	if s.Entities[0].Position.X != 1 || s.Entities[0].Position.Y != -1 {
		t.Fatalf("position not updated: %+v", s.Entities[0].Position)
	}
	if len(events) != 1 || events[0].Name != "moved" {
		t.Fatalf("unexpected events: %+v", events)
	}
}
