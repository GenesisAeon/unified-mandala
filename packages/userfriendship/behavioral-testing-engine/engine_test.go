package abtest

import (
	"testing"
)

func TestChoose(t *testing.T) {
	v := Choose()
	if v != "A" && v != "B" {
		t.Fatalf("unexpected variant %s", v)
	}
}
