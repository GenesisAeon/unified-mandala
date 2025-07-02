package matchengine

import "testing"

func TestMatch(t *testing.T) {
    users := []string{"u1", "u2"}
    projects := []string{"p1"}
    m := Match(users, projects)
    if m["u1"] != "p1" {
        t.Fatalf("expected p1 got %s", m["u1"])
    }
    if _, ok := m["u2"]; ok {
        t.Fatal("unexpected match for u2")
    }
}
