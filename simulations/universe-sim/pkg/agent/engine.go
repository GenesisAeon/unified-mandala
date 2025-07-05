package agent

import (
	core "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/core"
)

// Event represents a simulation event triggered by an agent.
type Event struct {
	Name string
}

// Agent performs an action on the simulation state and returns an event.
type Agent interface {
	Act(s *core.State) Event
}

// Engine coordinates agents and applies their actions to the state.
type Engine struct {
	agents []Agent
}

// NewEngine creates a new Engine instance.
func NewEngine(agents ...Agent) *Engine {
	return &Engine{agents: agents}
}

// Step executes one step for all agents and returns produced events.
func (e *Engine) Step(s *core.State) []Event {
	events := make([]Event, len(e.agents))
	for i, a := range e.agents {
		events[i] = a.Act(s)
	}
	return events
}

// MoveAgent increases the position of the first entity by a fixed velocity.
type MoveAgent struct {
	VX, VY float64
}

// Act applies the movement to the first entity and returns an event.
func (m MoveAgent) Act(s *core.State) Event {
	if len(s.Entities) == 0 {
		return Event{Name: "noop"}
	}
	e := &s.Entities[0]
	e.Position.X += m.VX
	e.Position.Y += m.VY
	return Event{Name: "moved"}
}
