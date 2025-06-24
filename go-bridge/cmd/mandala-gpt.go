package main

import (
	"context"
	"flag"
	"fmt"

	"github.com/GenesisAeon/unifiedmandala-go/pkg/gpt"
)

// Simple CLI to demonstrate GPT via API or link
func main() {
	mode := flag.String("mode", "api", "api or link")
	input := flag.String("input", "", "prompt text or URL")
	endpoint := flag.String("endpoint", "https://api.openai.com/v1/chat/completions", "")
	apiKey := flag.String("apiKey", "", "")
	flag.Parse()

	client := gpt.NewClient(*endpoint, *apiKey)
	var resp string
	var err error

	if *mode == "link" {
		resp, err = client.ProcessLink(context.Background(), *input)
	} else {
		resp, err = client.Ask(context.Background(), *input)
	}
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println(resp)
}
