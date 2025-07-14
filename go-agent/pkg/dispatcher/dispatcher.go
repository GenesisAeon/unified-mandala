package dispatcher

import (
	"sync"
	"time"
)

// Task is a unit of work that may fail.
type Task func() error

// Dispatcher executes submitted tasks concurrently and retries on failure.
type Dispatcher struct {
	workers    int
	maxRetries int
	jobs       chan Task
	failed     []Task
	mu         sync.Mutex
	wg         sync.WaitGroup
}

// New creates a dispatcher with the given worker count and retry limit.
func New(workers, maxRetries int) *Dispatcher {
	d := &Dispatcher{workers: workers, maxRetries: maxRetries, jobs: make(chan Task)}
	for i := 0; i < workers; i++ {
		d.wg.Add(1)
		go d.worker()
	}
	return d
}

// worker processes tasks from the queue with retry and backoff.
func (d *Dispatcher) worker() {
	defer d.wg.Done()
	for task := range d.jobs {
		retries := 0
		for {
			if err := task(); err != nil {
				retries++
				if retries > d.maxRetries {
					d.mu.Lock()
					d.failed = append(d.failed, task)
					d.mu.Unlock()
					break
				}
				time.Sleep(time.Duration(retries) * time.Second)
				continue
			}
			break
		}
	}
}

// Submit queues a task for execution.
func (d *Dispatcher) Submit(task Task) {
	d.jobs <- task
}

// Failed returns tasks that exceeded the retry limit.
func (d *Dispatcher) Failed() []Task {
	d.mu.Lock()
	defer d.mu.Unlock()
	out := make([]Task, len(d.failed))
	copy(out, d.failed)
	return out
}

// Stop waits for all workers to finish.
func (d *Dispatcher) Stop() {
	close(d.jobs)
	d.wg.Wait()
}
