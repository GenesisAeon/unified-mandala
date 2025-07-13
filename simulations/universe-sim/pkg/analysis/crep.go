package analysis

import (
	"bufio"
	"encoding/json"
	"os"
)

type Event struct {
	Type string `json:"type"`
}

func CountEventTypes(path string) (map[string]int, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	counts := make(map[string]int)
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		var e Event
		if err := json.Unmarshal(scanner.Bytes(), &e); err == nil {
			counts[e.Type]++
		}
	}
	return counts, scanner.Err()
}
