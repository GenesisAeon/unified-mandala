package auth

import (
	"github.com/hashicorp/vault/api"
	"github.com/unified-mandala/go-agent/internal/config"
)

type VaultClient struct {
	client *api.Client
}

func NewVaultClient(cfg config.VaultConfig) (*VaultClient, error) {
	if cfg.Addr == "" {
		return &VaultClient{}, nil
	}
	c, err := api.NewClient(&api.Config{Address: cfg.Addr})
	if err != nil {
		return nil, err
	}
	if cfg.Token != "" {
		c.SetToken(cfg.Token)
	}
	return &VaultClient{client: c}, nil
}

func (v *VaultClient) GetSecret(path string) (map[string]interface{}, error) {
	if v.client == nil {
		return nil, nil
	}
	s, err := v.client.Logical().Read(path)
	if err != nil || s == nil {
		return nil, err
	}
	return s.Data, nil
}
