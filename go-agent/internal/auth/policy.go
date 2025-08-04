package auth

import (
	"io"
	"os"

	"gopkg.in/yaml.v3"
)

// Policy holds role to handler mappings loaded from YAML.
type Policy struct {
	Roles map[string][]string `yaml:"roles"`
}

// LoadPolicy reads policy definitions from the given reader.
func LoadPolicy(r io.Reader) (*Policy, error) {
	var p Policy
	if err := yaml.NewDecoder(r).Decode(&p); err != nil {
		return nil, err
	}
	return &p, nil
}

// LoadPolicyFile loads policy definitions from the provided file path.
func LoadPolicyFile(path string) (*Policy, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return LoadPolicy(f)
}

// Authorize returns true if the given role may access the handler.
func (p *Policy) Authorize(role, handler string) bool {
	if p == nil {
		return false
	}
	for _, h := range p.Roles[role] {
		if h == handler {
			return true
		}
	}
	return false
}
