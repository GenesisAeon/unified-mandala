package config

import (
	"os"
	"time"
)

type VaultConfig struct {
	Addr  string
	Token string
}

type Config struct {
	NATSURL      string
	PollInterval time.Duration
	Vault        VaultConfig
}

func Load() Config {
	addr := os.Getenv("VAULT_ADDR")
	token := os.Getenv("VAULT_TOKEN")
	return Config{
		NATSURL:      "nats://localhost:4222",
		PollInterval: 5 * time.Second,
		Vault:        VaultConfig{Addr: addr, Token: token},
	}
}
