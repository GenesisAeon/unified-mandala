package client_test

import (
    "context"
    "testing"
    "time"

    natsserver "github.com/nats-io/nats-server/v2/server"
    "github.com/nats-io/nats.go"
    "github.com/GenesisAeon/unifiedmandala-go/pkg/bridge"
)

func runServer(tb testing.TB) (*natsserver.Server, string) {
    opts := &natsserver.Options{Port: -1}
    srv, err := natsserver.NewServer(opts)
    if err != nil {
        tb.Fatalf("server: %v", err)
    }
    go srv.Start()
    if !srv.ReadyForConnections(2 * time.Second) {
        tb.Fatalf("nats server not ready")
    }
    url := srv.ClientURL()
    return srv, url
}

func TestSubscribe(t *testing.T) {
    srv, url := runServer(t)
    defer srv.Shutdown()

    ch := make(chan string, 1)

    go bridge.Subscribe(url, "events", func(ctx context.Context, data []byte) { ch <- string(data) })

    time.Sleep(100 * time.Millisecond)

    nc, err := nats.Connect(url)
    if err != nil {
        t.Fatalf("connect: %v", err)
    }
    if err := nc.Publish("events", []byte("hello")); err != nil {
        t.Fatalf("publish: %v", err)
    }

    select {
    case msg := <-ch:
        if msg != "hello" {
            t.Fatalf("unexpected message %s", msg)
        }
    case <-time.After(time.Second):
        t.Fatal("timeout")
    }
}
