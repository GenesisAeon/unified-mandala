package client

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    "github.com/GenesisAeon/unifiedmandala-go/pkg/models"
    "github.com/GenesisAeon/unifiedmandala-go/pkg/bridge"
)

// RestClient holds base settings
type RestClient struct {
    baseURL string
    token   string
    client  *http.Client
}

// NewRestClient constructs a new REST client
func NewRestClient(baseURL, token string) *RestClient {
    return &RestClient{
        baseURL: baseURL,
        token:   token,
        client:  &http.Client{Timeout: 10 *time.Second},
    }
}

// GetMetaScores fetches MetaScore list
func (r *RestClient) GetMetaScores(ctx context.Context) ([]models.MetaScore, error) {
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, r.baseURL+"/api/meta-scores", nil)
    if err != nil {
        return nil, fmt.Errorf("create request: %w", err)
    }
    req.Header.Set("Authorization", "Bearer "+r.token)
    resp, err := r.client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("perform request: %w", err)
    }
    defer resp.Body.Close()
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("unexpected status %s", resp.Status)
    }
    var out []models.MetaScore
    err = json.NewDecoder(resp.Body).Decode(&out)
    return out, err
}

// SubscribeToCREPEvents connects to NATS and prints events
func SubscribeToCREPEvents(natsURL, subject string) error {
    return bridge.Subscribe(natsURL, subject, func(ctx context.Context, data []byte) {
        fmt.Println(string(data))
    })
}

// SubscribeCREP is a convenience passthrough
func SubscribeCREP(natsURL, subject string) error {
    return SubscribeToCREPEvents(natsURL, subject)
}
