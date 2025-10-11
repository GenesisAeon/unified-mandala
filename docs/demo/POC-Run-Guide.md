# POC Run: Bio-Sim → Sonification → AI Art

## Overview

Demonstrate the pipeline from scientific simulation through music and image generation in a single workflow.

### Steps

1. **Run Bio Simulation**
   ```bash
   bio-sim-service --config genome-sim.yaml --output genome-run.jsonl
   ```
2. **Compute CREP Scores**
   ```bash
   crep-scanner --input genome-run.jsonl --output crep-scores.json
   ```
3. **Sonify CREP Timeline**
   ```bash
   sonify-run --input crep-scores.json --model melody --output fractal-symphony.mid
   ```
4. **Generate AI Image**
   ```bash
   curl -X POST https://api.unifiedmandala.org/art/generate \
     -d '{"prompt":"A fractal symphony of DNA, watercolor style","steps":50}' \
     -H 'Content-Type: application/json'
   ```

## GIF Storyboard

| Frame | Scene              | Description                                                            | Duration |
| ----- | ------------------ | ---------------------------------------------------------------------- | -------- |
| 1     | Bio Simulation log | Terminal shows `genome-run.jsonl` being produced                       | 3s       |
| 2     | CREP Scoring       | Heatmap timeline for CREP scores appears                               | 4s       |
| 3     | Sonification       | MIDI notation scrolls with audio icon                                  | 4s       |
| 4     | Image Generation   | Progress bar then reveal of AI-generated fractal-DNA watercolor image  | 4s       |
| 5     | Sigil Creation     | Dashboard flashes new Sigil card with `fractalHash` and artifact links | 3s       |

_Use animated overlays: arrows, labels like “CREP → Melody”, “Genomes → Art”._
