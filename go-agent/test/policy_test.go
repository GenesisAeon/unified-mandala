package test

import (
	"strings"
	"testing"

	"github.com/unified-mandala/go-agent/internal/auth"
)

func TestPolicyAuthorize(t *testing.T) {
	data := `
roles:
  admin:
    - /task/create
    - /task/delete
  user:
    - /task/create
`
	policy, err := auth.LoadPolicy(strings.NewReader(data))
	if err != nil {
		t.Fatalf("load policy: %v", err)
	}
	if !policy.Authorize("admin", "/task/delete") {
		t.Fatalf("admin should be allowed to delete")
	}
	if policy.Authorize("user", "/task/delete") {
		t.Fatalf("user should not be allowed to delete")
	}
}
