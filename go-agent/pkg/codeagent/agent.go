package codeagent

// Agent provides a minimal language-aware code agent.
type Agent struct {
    Name string
}

// New creates a new Agent with the given name.
func New(name string) *Agent {
    return &Agent{Name: name}
}

// Run executes the provided code snippet.
// Currently it simply returns the snippet unchanged.
func (a *Agent) Run(code string) string {
    return code
}

