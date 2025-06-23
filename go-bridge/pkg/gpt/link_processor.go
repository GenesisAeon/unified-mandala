package gpt

import (
	"context"
	"io"
	"net/http"
	"regexp"
)

// ProcessLink fetches the URL content, strips HTML and sends to GPT API
func (c *GPTClient) ProcessLink(ctx context.Context, url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	re := regexp.MustCompile("<[^>]*>")
	text := re.ReplaceAllString(string(data), "")
	if len(text) > 2000 {
		text = text[:2000]
	}
	return c.Ask(ctx, text)
}
