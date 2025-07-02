package projectservice

import "sync"

// Project represents a community project.
type Project struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Notes string `json:"notes"`
}

var (
    mu       sync.Mutex
    projects = make(map[int]Project)
    nextID   int
)

// Create adds a new project and returns it.
func Create(name, notes string) Project {
    mu.Lock()
    defer mu.Unlock()
    nextID++
    p := Project{ID: nextID, Name: name, Notes: notes}
    projects[p.ID] = p
    return p
}

// Get returns a project by id.
func Get(id int) (Project, bool) {
    mu.Lock()
    defer mu.Unlock()
    p, ok := projects[id]
    return p, ok
}

// List returns all projects.
func List() []Project {
    mu.Lock()
    defer mu.Unlock()
    out := make([]Project, 0, len(projects))
    for _, p := range projects {
        out = append(out, p)
    }
    return out
}

// Delete removes a project by id.
func Delete(id int) {
    mu.Lock()
    defer mu.Unlock()
    delete(projects, id)
}
