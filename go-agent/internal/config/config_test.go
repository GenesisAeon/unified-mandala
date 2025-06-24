package config

import "testing"

func TestLoad(t *testing.T) {
	c := Load()
	if c.NATSURL == "" {
		t.Fatal("expected nats url")
	}
}
