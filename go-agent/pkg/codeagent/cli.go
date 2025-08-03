package codeagent

import (
    "flag"
    "fmt"
)

// RunCLI parses command-line flags and runs the agent.
func RunCLI() {
    name := flag.String("name", "CodeAgent", "agent name")
    code := flag.String("code", "", "code snippet to run")
    flag.Parse()

    agent := New(*name)
    result := agent.Run(*code)
    fmt.Print(result)
}

