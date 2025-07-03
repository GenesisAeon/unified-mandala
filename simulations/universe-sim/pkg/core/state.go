package core

type Vector struct {
	X, Y float64
}

type Entity struct {
	Position Vector
	Velocity Vector
}

type State struct {
	Entities []Entity
}

func NewState(n int) *State {
	s := &State{Entities: make([]Entity, n)}
	return s
}

func (s *State) Step() {
	for i := range s.Entities {
		e := &s.Entities[i]
		e.Position.X += e.Velocity.X
		e.Position.Y += e.Velocity.Y
	}
}
