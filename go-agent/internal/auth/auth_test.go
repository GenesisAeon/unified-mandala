package auth

import "testing"

func TestNewVaultClient(t *testing.T) {
	if NewVaultClient() == nil {
		t.Fatal("expected client")
	}
}
