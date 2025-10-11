# Sonifier: CREP-to-MIDI Music Generator

This module converts CREP timelines and simulation events into musical compositions.

## Features

- Map CREP metrics to melody parameters
- Generate MIDI files or play live via WebAudio
- Configurable scales, tempos, and instruments
- CLI & REST endpoints

## Installation

```bash
go get github.com/GenesisAeon/unifiedmandala/pkg/sonifier/melody
```

## Usage Example (CLI)

```bash
sonify-run \
  --input events.jsonl \
  --model melody \
  --scale major \
  --tempo 120 \
  --output mandala.mid
```

## API Documentation

### REST Bridge (`sonifier-service/swagger.yaml`)

```yaml
paths:
  /sonify:
    post:
      summary: Generate MIDI from events
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SonifyRequest'
      responses:
        '201':
          description: MIDI file location
components:
  schemas:
    SonifyRequest:
      type: object
      required: [inputPath, model]
      properties:
        inputPath: { type: string }
        model:
          type: string
          enum: [melody, harmony, rhythm]
        scale: { type: string }
        tempo: { type: integer }
    SonifyResponse:
      type: object
      properties:
        url: { type: string }
```
