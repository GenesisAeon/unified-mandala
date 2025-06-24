package scheduler

import (
	"context"
	"testing"
	"time"
)

func TestScheduler(t *testing.T) {
	s := New("", 10*time.Millisecond)
	called := make(chan struct{}, 1)
	s.OnTask(func() { called <- struct{}{} })
	ctx, cancel := context.WithCancel(context.Background())
	go s.Start(ctx)
	select {
	case <-called:
	case <-time.After(100 * time.Millisecond):
		t.Fatal("task not executed")
	}
	cancel()
}
