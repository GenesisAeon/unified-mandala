package layercontrol

type Controller struct {
        layers map[string]bool
}

func New() *Controller {
        return &Controller{layers: make(map[string]bool)}
}

func (c *Controller) Set(name string, active bool) {
        c.layers[name] = active
}

func (c *Controller) IsActive(name string) bool {
        return c.layers[name]
}
