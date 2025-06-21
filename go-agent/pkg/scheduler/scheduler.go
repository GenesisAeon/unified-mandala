package scheduler

import (
	"context"
	"time"
)

type Scheduler struct {
	natsURL      string
	pollInterval time.Duration
	tasks        chan func()
}

func New(natsURL string, interval time.Duration) *Scheduler {
	return &Scheduler{
		natsURL:      natsURL,
		pollInterval: interval,
		tasks:        make(chan func(), 10),
	}
}

func (s *Scheduler) OnTask(fn func()) {
	s.tasks <- fn
}

func (s *Scheduler) Start(ctx context.Context) {
	ticker := time.NewTicker(s.pollInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case t := <-s.tasks:
			go t()
		case <-ticker.C:
			// poll for tasks - placeholder
		}
	}
}
