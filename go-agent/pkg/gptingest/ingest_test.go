package gptingest

import "testing"

func TestIngestFromAPI(t *testing.T) {
    res, err := IngestFromAPI("http://example.com")
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    expected := "ingested API source http://example.com"
    if res != expected {
        t.Fatalf("expected %q, got %q", expected, res)
    }
}

func TestIngestFromLink(t *testing.T) {
    res, err := IngestFromLink("http://example.com/link")
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    expected := "ingested link source http://example.com/link"
    if res != expected {
        t.Fatalf("expected %q, got %q", expected, res)
    }
}

