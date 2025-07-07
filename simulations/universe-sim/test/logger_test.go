package test

import (
	"path/filepath"
	"testing"

	"github.com/GenesisAeon/unified-mandala/universe-sim/pkg/logger"
)

func TestJSONLLogger(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "events.jsonl")
	l, err := logger.NewJSONLLogger(path)
	if err != nil {
		t.Fatalf("failed to create logger: %v", err)
	}
	if err := l.Log(map[string]string{"event": "start"}); err != nil {
		t.Fatalf("log failed: %v", err)
	}
	l.Close()

	var got []string
	err = logger.ProcessJSONL(path, func(m map[string]interface{}) {
		if e, ok := m["event"].(string); ok {
			got = append(got, e)
		}
	})
	if err != nil {
		t.Fatalf("process failed: %v", err)
	}
	if len(got) != 1 || got[0] != "start" {
		t.Fatalf("unexpected events %v", got)
	}
}
