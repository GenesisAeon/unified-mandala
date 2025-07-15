package test

import (
	"testing"
	"time"

	natsserver "github.com/nats-io/nats-server/v2/server"
	"github.com/nats-io/nats.go"

	"github.com/unified-mandala/go-agent/pkg/hooks"
)

func runNATSServer(tb testing.TB) (*natsserver.Server, string) {
	opts := &natsserver.Options{Port: -1}
	srv, err := natsserver.NewServer(opts)
	if err != nil {
		tb.Fatalf("server: %v", err)
	}
	go srv.Start()
	if !srv.ReadyForConnections(2 * time.Second) {
		tb.Fatalf("nats server not ready")
	}
	return srv, srv.ClientURL()
}

func TestEventHookWorkflow(t *testing.T) {
	srv, url := runNATSServer(t)
	defer srv.Shutdown()

	nc, err := nats.Connect(url)
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	defer nc.Close()

	pub := hooks.NewPublisher(nc)
	sub, err := nc.SubscribeSync("events")
	if err != nil {
		t.Fatalf("subscribe: %v", err)
	}

	if err := pub.Publish("events", []byte("hello")); err != nil {
		t.Fatalf("publish: %v", err)
	}

	msg, err := sub.NextMsg(time.Second)
	if err != nil {
		t.Fatalf("nextmsg: %v", err)
	}
	if string(msg.Data) != "hello" {
		t.Fatalf("unexpected %s", msg.Data)
	}
}
