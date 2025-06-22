package main

import (
    "context"
    "encoding/json"
    "fmt"
    "os"
)

// VectorIndexer generates embeddings for text and pushes them to an external DB.
type VectorIndexer struct {
    Embedder func(ctx context.Context, text string) ([]float64, error)
    Sender    func(ctx context.Context, embedding []float64) error
}

// IndexText creates an embedding for the given text and stores it via Sender.
func (vi *VectorIndexer) IndexText(ctx context.Context, text string) error {
    emb, err := vi.Embedder(ctx, text)
    if err != nil {
        return fmt.Errorf("embedding failed: %w", err)
    }
    if err := vi.Sender(ctx, emb); err != nil {
        return fmt.Errorf("send failed: %w", err)
    }
    return nil
}

// Example usage with JSON input from STDIN.
func main() {
    ctx := context.Background()
    vi := &VectorIndexer{
        Embedder: func(ctx context.Context, text string) ([]float64, error) {
            // simple placeholder: length of text as a single vector value
            return []float64{float64(len(text))}, nil
        },
        Sender: func(ctx context.Context, embedding []float64) error {
            b, _ := json.Marshal(embedding)
            fmt.Printf("store embedding: %s\n", string(b))
            return nil
        },
    }

    var input struct{ Text string `json:"text"` }
    if err := json.NewDecoder(os.Stdin).Decode(&input); err != nil {
        fmt.Println("decode error:", err)
        return
    }
    if err := vi.IndexText(ctx, input.Text); err != nil {
        fmt.Println("index error:", err)
    }
}
