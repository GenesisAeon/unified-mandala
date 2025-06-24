package layercontrol

import "testing"

func TestController(t *testing.T) {
	c := New()
	c.Set("alpha", true)
	if !c.IsActive("alpha") {
		t.Fatal("expected layer active")
	}
}
