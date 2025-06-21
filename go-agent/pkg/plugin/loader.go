package plugin

import "plugin"

func Load(path string) (plugin.Symbol, error) {
	p, err := plugin.Open(path)
	if err != nil {
		return nil, err
	}
	return p.Lookup("Plugin")
}
