package policy

import "errors"

// Enforcer loads a policy file and checks consent for operations.
type Enforcer struct {
    Policy map[string]bool
}

// New creates a new policy enforcer with given rules.
func New(rules map[string]bool) *Enforcer {
    return &Enforcer{Policy: rules}
}

// Check returns an error if operation is not allowed.
func (e *Enforcer) Check(op string) error {
    if allowed, ok := e.Policy[op]; ok && allowed {
        return nil
    }
    return errors.New("operation not permitted")
}
