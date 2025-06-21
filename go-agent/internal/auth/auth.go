package auth

type VaultClient struct{}

func NewVaultClient() *VaultClient {
	return &VaultClient{}
}
