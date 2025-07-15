package auth

import (
    "context"
    "testing"
    "time"
)

func TestStartTokenRotationNil(t *testing.T) {
    StartTokenRotation(context.Background(), nil, time.Millisecond)
}
