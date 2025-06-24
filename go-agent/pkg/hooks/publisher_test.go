package hooks

import "testing"

func TestPublishNil(t *testing.T) {
	p := NewPublisher(nil)
	if err := p.Publish("s", []byte("x")); err != nil {
		t.Fatalf("publish: %v", err)
	}
}
