package api

import (
    "fmt"

    "github.com/nats-io/nats.go"
)

// SubscribeToCREPEvents verbindet sich mit NATS und gibt empfangene Nachrichten aus.
func SubscribeToCREPEvents(natsURL, subject string) error {
    nc, err := nats.Connect(natsURL)
    if err != nil {
        return err
    }
    _, err = nc.Subscribe(subject, func(msg *nats.Msg) {
        fmt.Printf("CREP Event: %s\n", string(msg.Data))
    })
    return err
}
