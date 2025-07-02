package models_test

import (
	"os"
	"testing"

	yaml "gopkg.in/yaml.v3"
)

type Countries struct {
	Countries []struct {
		Code string `yaml:"code"`
		Name string `yaml:"name"`
	} `yaml:"countries"`
}

type Regions struct {
	Regions []struct {
		IP      string `yaml:"ip"`
		Country string `yaml:"country"`
		Region  string `yaml:"region"`
	} `yaml:"regions"`
}

func TestLoadModels(t *testing.T) {
	b, err := os.ReadFile("country.yaml")
	if err != nil {
		t.Fatal(err)
	}
	var c Countries
	if err := yaml.Unmarshal(b, &c); err != nil {
		t.Fatal(err)
	}
	if len(c.Countries) != 5 {
		t.Fatalf("expected 5 countries, got %d", len(c.Countries))
	}

	b, err = os.ReadFile("region.yaml")
	if err != nil {
		t.Fatal(err)
	}
	var r Regions
	if err := yaml.Unmarshal(b, &r); err != nil {
		t.Fatal(err)
	}
	if len(r.Regions) != 5 {
		t.Fatalf("expected 5 regions, got %d", len(r.Regions))
	}
}
