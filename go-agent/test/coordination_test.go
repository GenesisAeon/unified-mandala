package test

import (
	"context"
	"testing"

	"github.com/unified-mandala/go-agent/pkg/handler"
)

type stubHandler struct {
	t      *testing.T
	called bool
}

func (s *stubHandler) Handle(ctx context.Context, payload []byte) error {
	s.called = true
	if ctx.Value(handler.CorrelationIDKey) == nil || ctx.Value(handler.TraceIDKey) == nil {
		s.t.Errorf("missing ids in context")
	}
	return nil
}

func TestCoordinationHandler(t *testing.T) {
	h1 := &stubHandler{t: t}
	h2 := &stubHandler{t: t}
	coord := handler.NewCoordination(h1, h2)
	ctx := handler.WithIDs(context.Background(), "c1", "t1")
	if err := coord.Handle(ctx, []byte("data")); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !h1.called || !h2.called {
		t.Fatalf("handlers not called")
	}
}
