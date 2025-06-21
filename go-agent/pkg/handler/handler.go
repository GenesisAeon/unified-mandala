package handler

import "context"

type Handler interface {
	Handle(ctx context.Context, payload []byte) error
}

func Select(t string) Handler {
	return &noopHandler{}
}

type noopHandler struct{}

func (n *noopHandler) Handle(ctx context.Context, payload []byte) error {
	return nil
}
