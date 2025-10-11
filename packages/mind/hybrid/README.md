# Mind Simulation: Hybrid Symbolic & Neural Agents

This module implements cognitive agents combining symbolic logic and neural networks.

## Features

- Production-rule engine for symbolic reasoning
- Simple MLP networks for perception modules
- Hybrid execution pipeline with context switching
- CLI & gRPC interface

## Installation

```bash
go get github.com/GenesisAeon/unifiedmandala/pkg/mind/hybrid
```

## Usage Example (Go)

```go
import "github.com/GenesisAeon/unifiedmandala/pkg/mind/hybrid"

func main() {
  config := hybrid.AgentConfig{
    SymbolicRules: "rules.conf",
    NeuralModel:   "models/mind-net.onnx",
  }
  agent := hybrid.NewAgent(config)
  thought, err := agent.StepThought("What is the meaning of the fractal?")
  if err != nil { panic(err) }
  fmt.Println("Agent thought:", thought)
}
```

## API Documentation

### gRPC Service: `MindService`

```protobuf
service MindService {
  rpc LoadMind (MindConfig) returns (MindState);
  rpc StepThought (ThoughtRequest) returns (ThoughtResponse);
}
```

### REST Bridge (`mind-engine/swagger.yaml`)

```yaml
paths:
  /mind/step:
    post:
      summary: Evaluate one thought step
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThoughtRequest'
      responses:
        '200':
          description: ThoughtResponse JSON
components:
  schemas:
    ThoughtRequest:
      type: object
      required: [input]
      properties:
        input: { type: string }
    ThoughtResponse:
      type: object
      properties:
        output: { type: string }
```
