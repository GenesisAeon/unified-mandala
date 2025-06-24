package handler

import (
	"context"
	"testing"
)

type testHandler struct{ called int }

func (t *testHandler) Handle(ctx context.Context, payload []byte) error {
	t.called++
	return nil
}

func TestCoordination(t *testing.T) {
	h := &testHandler{}
	c := NewCoordination(h)
	ctx := WithIDs(context.Background(), "c", "t")
	if err := c.Handle(ctx, []byte("data")); err != nil {
		t.Fatalf("coordination handle: %v", err)
	}
	if h.called != 1 {
		t.Fatalf("expected 1 call, got %d", h.called)
	}
}
