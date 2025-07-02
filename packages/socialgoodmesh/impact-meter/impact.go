package impactmeter

// ImpactScore sums given values as a naive impact metric.
func ImpactScore(values []int) int {
    sum := 0
    for _, v := range values {
        sum += v
    }
    return sum
}
