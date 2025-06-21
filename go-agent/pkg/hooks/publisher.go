package hooks

import "github.com/nats-io/nats.go"

// Publisher sends events to NATS.
type Publisher struct {
    nc *nats.Conn
}

// NewPublisher creates a publisher with a NATS connection.
func NewPublisher(nc *nats.Conn) *Publisher {
    return &Publisher{nc: nc}
}

// Publish sends the given payload to the subject.
func (p *Publisher) Publish(subject string, payload []byte) error {
    if p.nc == nil {
        return nil
    }
    return p.nc.Publish(subject, payload)
}
