package dispatcher

import (
	"errors"
	"testing"
	"time"
)

func TestRetryAndDeadLetter(t *testing.T) {
	d := New(1, 2)
	attempts := 0
	done := make(chan struct{})
	d.Submit(func() error {
		attempts++
		if attempts <= 1 {
			return errors.New("fail")
		}
		close(done)
		return nil
	})
	select {
	case <-done:
		d.Stop()
		if len(d.Failed()) != 0 {
			t.Fatalf("task should not fail")
		}
	case <-time.After(5 * time.Second):
		d.Stop()
		t.Fatal("timeout")
	}
}

func TestDeadLetter(t *testing.T) {
	d := New(1, 1)
	d.Submit(func() error { return errors.New("fail") })
	d.Stop()
	if len(d.Failed()) != 1 {
		t.Fatalf("expected 1 failed task, got %d", len(d.Failed()))
	}
}
