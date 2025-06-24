package client

import "testing"

func TestBridge(t *testing.T) {
	b := NewBridge("http://example.com")
	b.PublishEvent("topic", "id")
}
