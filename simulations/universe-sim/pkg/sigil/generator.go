package sigil

import (
	"crypto/sha1"
	"fmt"
)

// Generate returns a simple hex hash as sigil identifier.
func Generate(seed string) string {
	h := sha1.Sum([]byte(seed))
	return fmt.Sprintf("%x", h[:8])
}
