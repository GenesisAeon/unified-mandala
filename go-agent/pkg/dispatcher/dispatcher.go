package dispatcher

import "sync"

type Dispatcher struct {
	workers int
	wg      sync.WaitGroup
	jobs    chan func()
}

func New(workers int) *Dispatcher {
	d := &Dispatcher{workers: workers, jobs: make(chan func())}
	for i := 0; i < workers; i++ {
		d.wg.Add(1)
		go func() {
			defer d.wg.Done()
			for job := range d.jobs {
				job()
			}
		}()
	}
	return d
}

func (d *Dispatcher) Submit(job func()) {
	d.jobs <- job
}

func (d *Dispatcher) Stop() {
	close(d.jobs)
	d.wg.Wait()
}
