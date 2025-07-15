package test

import (
    "testing"
    p "github.com/unified-mandala/go-agent/pkg/plugin"
)

func TestPrioritizeTasks(t *testing.T) {
    tasks := []p.Task{
        {ID: "a", Features: []float64{1,2}},
        {ID: "b", Features: []float64{0,3}},
    }
    weights := []float64{0.5, 1}
    scored := p.PrioritizeTasks(tasks, weights)
    if scored[0].ID != "b" {
        t.Fatalf("expected task b first")
    }
    if scored[0].Score <= scored[1].Score {
        t.Fatalf("scores not sorted")
    }
}
