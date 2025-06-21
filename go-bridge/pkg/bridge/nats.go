package bridge

import (
    "context"
    "fmt"

    "github.com/nats-io/nats.go"
)

// Subscribe sets up a NATS subscription
func Subscribe(natsURL, subject string, handler func(ctx context.Context, data []byte)) error {
    nc, err := nats.Connect(natsURL)
    if err != nil {
        return fmt.Errorf("connect nats: %w", err)
    }
    _, err = nc.Subscribe(subject, func(msg *nats.Msg) {
        handler(context.Background(), msg.Data)
    })
    return err
}
