package test

import (
        "testing"

        "github.com/unified-mandala/go-agent/pkg/layercontrol"
)

func TestLayerControl(t *testing.T) {
        c := layercontrol.New()
        c.Set("alpha", true)
        if !c.IsActive("alpha") {
                t.Fatal("expected layer active")
        }
}
