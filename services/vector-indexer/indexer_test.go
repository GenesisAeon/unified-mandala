package main

import (
    "context"
    "testing"
)

func TestVectorIndexer(t *testing.T) {
    vi := &VectorIndexer{
        Embedder: func(ctx context.Context, text string) ([]float64, error) {
            return []float64{1, 2}, nil
        },
        Sender: func(ctx context.Context, embedding []float64) error {
            if len(embedding) != 2 {
                t.Fatalf("unexpected length")
            }
            return nil
        },
    }
    if err := vi.IndexText(context.Background(), "foo"); err != nil {
        t.Fatal(err)
    }
}
