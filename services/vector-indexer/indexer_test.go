package main

import (
    "context"
    "errors"
    "strings"
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

func TestVectorIndexer_EmbedderError(t *testing.T) {
    vi := &VectorIndexer{
        Embedder: func(ctx context.Context, text string) ([]float64, error) {
            return nil, errors.New("boom")
        },
        Sender: func(ctx context.Context, embedding []float64) error {
            return nil
        },
    }
    err := vi.IndexText(context.Background(), "x")
    if err == nil || !strings.Contains(err.Error(), "embedding failed") {
        t.Fatalf("expected embedder error, got %v", err)
    }
}

func TestVectorIndexer_SenderError(t *testing.T) {
    vi := &VectorIndexer{
        Embedder: func(ctx context.Context, text string) ([]float64, error) {
            return []float64{1}, nil
        },
        Sender: func(ctx context.Context, embedding []float64) error {
            return errors.New("boom")
        },
    }
    err := vi.IndexText(context.Background(), "x")
    if err == nil || !strings.Contains(err.Error(), "send failed") {
        t.Fatalf("expected sender error, got %v", err)
    }
}
