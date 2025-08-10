from pathlib import Path
from typing import Any, Dict, List
import json

from fastapi import FastAPI, Request

app = FastAPI()


def load_recent_samples() -> List[Dict[str, Any]]:
    """Load recent training samples from a placeholder JSON file."""
    samples_path = Path("training_samples.json")
    if samples_path.exists():
        return json.loads(samples_path.read_text())
    return []


def run_lora_finetune(base_model: str, data: List[Dict[str, Any]], output_dir: str) -> str:
    """Pretend to run LoRA fine-tuning and write artifacts."""
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    artifact = out_dir / "model.txt"
    artifact.write_text(f"finetuned {base_model} on {len(data)} samples")
    return str(artifact)


# FastAPI's decorator types can be problematic for static analysis
@app.post("/finetune")  # type: ignore[misc]
async def finetune(req: Request) -> Dict[str, Any]:
    params = await req.json()
    samples = load_recent_samples()
    model_path = run_lora_finetune(
        base_model=params.get("base_model", "base-model"),
        data=samples,
        output_dir=params.get("output_dir", "/models"),
    )
    return {"status": "finetuned", "model_path": model_path}
