package auth

import (
    "context"
    "time"
)

// StartTokenRotation periodically renews the Vault token.
// If the Vault client is nil or rotation fails, it silently exits.
func StartTokenRotation(ctx context.Context, vc *VaultClient, interval time.Duration) {
    if vc == nil || vc.client == nil {
        return
    }
    ticker := time.NewTicker(interval)
    go func() {
        defer ticker.Stop()
        for {
            select {
            case <-ticker.C:
                vc.client.Auth().Token().RenewSelf(0)
            case <-ctx.Done():
                return
            }
        }
    }()
}
