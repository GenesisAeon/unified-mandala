package handler

import (
	"context"
)

// Context keys for tracing
type contextKey string

const (
	CorrelationIDKey contextKey = "correlationId"
	TraceIDKey       contextKey = "traceId"
)

// CoordinationHandler dispatches payloads to multiple child handlers.
type CoordinationHandler struct {
	handlers []Handler
}

// NewCoordination creates a new CoordinationHandler.
func NewCoordination(hs ...Handler) *CoordinationHandler {
	return &CoordinationHandler{handlers: hs}
}

// WithIDs injects correlation and trace IDs if missing.
func WithIDs(ctx context.Context, correlationID, traceID string) context.Context {
	if ctx.Value(CorrelationIDKey) == nil {
		ctx = context.WithValue(ctx, CorrelationIDKey, correlationID)
	}
	if ctx.Value(TraceIDKey) == nil {
		ctx = context.WithValue(ctx, TraceIDKey, traceID)
	}
	return ctx
}

// Handle forwards the payload to all child handlers with the same context.
func (c *CoordinationHandler) Handle(ctx context.Context, payload []byte) error {
	for _, h := range c.handlers {
		if err := h.Handle(ctx, payload); err != nil {
			return err
		}
	}
	return nil
}
