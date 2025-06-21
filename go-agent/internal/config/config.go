package config

import (
	"time"
)

type Config struct {
	NATSURL      string
	PollInterval time.Duration
}

func Load() Config {
	// For simplicity, return defaults
	return Config{
		NATSURL:      "nats://localhost:4222",
		PollInterval: 5 * time.Second,
	}
}
