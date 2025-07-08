package config

import "testing"

func TestLoad(t *testing.T) {
	c := Load()
	if c.NATSURL == "" {
		t.Fatal("expected nats url")
	}
	if c.Vault.Addr != "" {
		if c.Vault.Token == "" {
			t.Fatal("expected vault token when addr set")
		}
	}
}
