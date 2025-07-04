package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/GenesisAeon/unifiedmandala-go/pkg/codeagent"
)

func main() {
	file := flag.String("file", "", "path to source file")
	flag.Parse()
	if *file == "" {
		log.Fatal("missing -file")
	}
	todos, err := codeagent.ParseTODOs(*file)
	if err != nil {
		log.Fatal(err)
	}
	for _, t := range todos {
		fmt.Println(t)
	}
}
