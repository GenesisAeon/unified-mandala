package dispatcher

import "testing"

func TestDispatcher(t *testing.T) {
	d := New(1)
	done := make(chan struct{})
	d.Submit(func() { close(done) })
	<-done
	d.Stop()
}
