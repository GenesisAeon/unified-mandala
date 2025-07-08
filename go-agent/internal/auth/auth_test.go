package auth

import (
	"github.com/unified-mandala/go-agent/internal/config"
	"testing"
)

func TestNewVaultClient(t *testing.T) {
	c, err := NewVaultClient(config.VaultConfig{Addr: "http://localhost:8200", Token: ""})
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	if c == nil {
		t.Fatal("expected client")
	}
}
