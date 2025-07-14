package dispatcher

import "testing"

func TestDispatcher(t *testing.T) {
	d := New(1, 0)
	done := make(chan struct{})
	d.Submit(func() error { close(done); return nil })
	<-done
	d.Stop()
	if len(d.Failed()) != 0 {
		t.Fatalf("unexpected failed tasks")
	}
}
