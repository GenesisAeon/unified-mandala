package bridge

import (
	"context"
	"testing"
)

func TestSubscribeError(t *testing.T) {
	err := Subscribe("nats://127.0.0.1:1", "foo", func(ctx context.Context, data []byte) {})
	if err == nil {
		t.Fatal("expected error connecting to nats")
	}
}
