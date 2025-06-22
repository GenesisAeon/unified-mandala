package watchers

import (
    "log"
    "os"
    "time"
)

type AdvancedTodoWatcher struct {
    path    string
    lastMod time.Time
}

func NewAdvancedTodoWatcher(path string) *AdvancedTodoWatcher {
    return &AdvancedTodoWatcher{path: path}
}

func (w *AdvancedTodoWatcher) Check() {
    info, err := os.Stat(w.path)
    if err != nil {
        return
    }
    if info.ModTime().After(w.lastMod) {
        w.lastMod = info.ModTime()
        log.Printf("advancedToDo updated: %s", w.path)
    }
}

func (w *AdvancedTodoWatcher) Start(interval time.Duration, stop <-chan struct{}) {
    ticker := time.NewTicker(interval)
    defer ticker.Stop()
    for {
        select {
        case <-ticker.C:
            w.Check()
        case <-stop:
            return
        }
    }
}
