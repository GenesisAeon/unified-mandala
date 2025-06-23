package gpt

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
)

// GPTClient handles simple GPT API requests
// It can be reused by CLI or other services.
type GPTClient struct {
	Endpoint string
	APIKey   string
}

// NewClient creates a GPTClient with endpoint and apiKey
func NewClient(endpoint, apiKey string) *GPTClient {
	return &GPTClient{Endpoint: endpoint, APIKey: apiKey}
}

// Ask sends a prompt to the GPT API and returns the text response
func (c *GPTClient) Ask(ctx context.Context, prompt string) (string, error) {
	body := map[string]string{"prompt": prompt}
	b, _ := json.Marshal(body)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.Endpoint, bytes.NewReader(b))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	var resp struct {
		Text string `json:"text"`
	}
	if err := json.NewDecoder(res.Body).Decode(&resp); err != nil {
		return "", err
	}
	return resp.Text, nil
}
