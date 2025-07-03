package core

// ApplyGravity applies a constant downward acceleration to all entities.
func ApplyGravity(s *State, g float64) {
	for i := range s.Entities {
		e := &s.Entities[i]
		e.Velocity.Y -= g
	}
}
