package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"time"
)

type Cell struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type State struct {
	RunID     string `json:"runId"`
	Round     int    `json:"round"`
	Explorer  Cell   `json:"explorer"`
	Observer  Cell   `json:"observer"`
	Resources int    `json:"resourcesCollected"`
}

type Event struct {
	Timestamp time.Time `json:"timestamp"`
	Type      string    `json:"type"`
	AgentID   string    `json:"agentId,omitempty"`
	Detail    string    `json:"detail"`
}

func main() {
	rand.Seed(time.Now().UnixNano())
	runID := fmt.Sprintf("run-%d", time.Now().Unix())

	explorer := Cell{0, 0}
	observer := Cell{0, 0}
	resources := 0

	stateFile, err := os.Create("state-" + runID + "-v1.jsonl")
	if err != nil {
		panic(err)
	}
	defer stateFile.Close()

	eventFile, err := os.Create("events-" + runID + ".jsonl")
	if err != nil {
		panic(err)
	}
	defer eventFile.Close()

	for round := 1; round <= 5; round++ {
		prev := explorer
		explorer.X = rand.Intn(10)
		explorer.Y = rand.Intn(10)
		resources += rand.Intn(3)
		observer = explorer

		st := State{
			RunID:     runID,
			Round:     round,
			Explorer:  explorer,
			Observer:  observer,
			Resources: resources,
		}
		b, _ := json.Marshal(st)
		stateFile.Write(append(b, '\n'))

		moveEvent := Event{
			Timestamp: time.Now().UTC(),
			Type:      "ExplorerMoved",
			AgentID:   "explorer",
			Detail:    fmt.Sprintf("from (%d,%d) to (%d,%d)", prev.X, prev.Y, explorer.X, explorer.Y),
		}
		mb, _ := json.Marshal(moveEvent)
		eventFile.Write(append(mb, '\n'))

		resEvent := Event{
			Timestamp: time.Now().UTC(),
			Type:      "ResourcesUpdated",
			Detail:    fmt.Sprintf("total %d", resources),
		}
		rb, _ := json.Marshal(resEvent)
		eventFile.Write(append(rb, '\n'))

		fmt.Printf("Round %d: Explorer %v, Resources %d\n", round, explorer, resources)
	}
}
