package handler

import (
	"context"
	"testing"
)

func TestSelect(t *testing.T) {
	h := Select("noop")
	if err := h.Handle(context.Background(), []byte("")); err != nil {
		t.Fatalf("handle error: %v", err)
	}
}
