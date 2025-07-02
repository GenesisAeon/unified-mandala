package regionprofileservice

import "testing"

func TestLookupRegion(t *testing.T) {
    r := LookupRegion("127.0.0.1")
    if r == nil || r.Region != "Berlin" {
        t.Fatalf("expected Berlin, got %#v", r)
    }
}
