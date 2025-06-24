package errors

import "testing"

func TestErrTaskFailed(t *testing.T) {
	if ErrTaskFailed.Error() != "task failed" {
		t.Fatal("unexpected error text")
	}
}
