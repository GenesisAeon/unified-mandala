package abtest

import "math/rand"

var variants = []string{"A", "B"}

func Choose() string {
	return variants[rand.Intn(len(variants))]
}
