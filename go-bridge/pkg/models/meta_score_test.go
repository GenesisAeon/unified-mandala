package models

import "testing"

func TestMetaScore(t *testing.T) {
	m := MetaScore{EntryID: "id"}
	if m.EntryID != "id" {
		t.Fatal("unexpected id")
	}
}
