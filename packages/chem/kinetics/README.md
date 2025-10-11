# Chemistry Simulation: Kinetics & Molecule Module

This module provides tools for simulating chemical reaction kinetics and molecular structures.

## Features

- Reaction equation parser and ODE-based kinetics solver
- Molecule graph representation (atoms & bonds)
- Export results to JSON and YAML
- REST & gRPC service endpoints

## Installation

```bash
# From project root
go get github.com/GenesisAeon/unifiedmandala/pkg/chem/kinetics
```

## Usage Example (Go)

```go
import "github.com/GenesisAeon/unifiedmandala/pkg/chem/kinetics"

func main() {
  config := kinetics.ReactionConfig{
    Equations: []string{"A + B -> C : 0.1"},
    Duration:  100,
    StepSize:  0.1,
  }
  result, err := kinetics.SimulateReaction(config)
  if err != nil { panic(err) }
  kinetics.SaveYAML(result, "reaction-output.yaml")
}
```

## API Documentation

### gRPC Service: `ChemistryService`

```protobuf
service ChemistryService {
  rpc ComputeReaction (ReactionConfig) returns (ReactionResult);
}
```

### REST Bridge (`chem-sim-engine/swagger.yaml`)

```yaml
paths:
  /chem/kinetics/simulate:
    post:
      summary: Compute reaction kinetics
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReactionConfig'
      responses:
        '200':
          description: ReactionResult JSON
components:
  schemas:
    ReactionConfig:
      type: object
      required: [equations, duration, stepSize]
      properties:
        equations:
          type: array
          items: { type: string }
        duration: { type: number }
        stepSize: { type: number }
    ReactionResult:
      type: object
      properties:
        timeSeries: { type: array, items: { type: object } }
        finalConcentrations: { type: object }
```
