package regionprofileservice

import (
	"encoding/json"
	"net/http"
	"os"

	yaml "gopkg.in/yaml.v3"
)

type Region struct {
	IP      string `yaml:"ip" json:"ip"`
	Country string `yaml:"country" json:"country"`
	Region  string `yaml:"region" json:"region"`
}

type regionData struct {
	Regions []Region `yaml:"regions"`
}

var regions []Region

func init() {
	b, err := os.ReadFile("models/region.yaml")
	if err == nil {
		var d regionData
		if err := yaml.Unmarshal(b, &d); err == nil {
			regions = d.Regions
		}
	}
}

func LookupRegion(ip string) *Region {
	for _, r := range regions {
		if r.IP == ip {
			return &r
		}
	}
	return nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	ip := r.URL.Query().Get("ip")
	if ip == "" {
		ip = r.RemoteAddr
	}
	if region := LookupRegion(ip); region != nil {
		json.NewEncoder(w).Encode(region)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}
