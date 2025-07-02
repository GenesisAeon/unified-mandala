package projectservice

import "testing"

func TestCRUD(t *testing.T) {
    p := Create("Test", "demo")
    if p.ID == 0 {
        t.Fatal("expected id")
    }
    if got, ok := Get(p.ID); !ok || got.Name != "Test" {
        t.Fatalf("get failed: %+v", got)
    }
    if len(List()) == 0 {
        t.Fatal("list should return items")
    }
    Delete(p.ID)
    if _, ok := Get(p.ID); ok {
        t.Fatal("delete failed")
    }
}
