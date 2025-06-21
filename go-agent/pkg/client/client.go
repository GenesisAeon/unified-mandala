package client

type Bridge struct{}

func NewBridge(apiURL string) *Bridge {
	return &Bridge{}
}

func (b *Bridge) PublishEvent(topic string, id string) {}
