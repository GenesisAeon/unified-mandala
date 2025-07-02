package impactmeter

import "testing"

func TestImpactScore(t *testing.T) {
    score := ImpactScore([]int{1, 2, 3})
    if score != 6 {
        t.Fatalf("expected 6 got %d", score)
    }
}
