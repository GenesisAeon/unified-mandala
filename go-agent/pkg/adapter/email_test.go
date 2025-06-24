package adapter

import "testing"

func TestSendEmail(t *testing.T) {
	if err := SendEmail("a@b.com", "sub", "body"); err != nil {
		t.Fatalf("SendEmail returned error: %v", err)
	}
}
