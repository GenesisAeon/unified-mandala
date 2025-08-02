import yaml
import requests

class SigillinScheduler:
    def __init__(self, config_file='pipeline_config.yaml'):
        with open(config_file) as f:
            cfg = yaml.safe_load(f.read())
        self.map = cfg['sigillin_map']
        self.thresholds = cfg['crep_thresholds']

    def pick_service(self, task_type, crep):
        service = self.map.get(task_type)
        threshold = self.thresholds.get(service, 0.6)
        if crep >= threshold:
            return service
        return None

    def route(self, sigillin_event):
        # sigillin_event = {task_type, crep_score, data}
        task_type = sigillin_event['task_type']
        crep = sigillin_event.get('crep_score', 1.0)
        service = self.pick_service(task_type, crep)
        if not service:
            print(f"[SKIP] CREP zu niedrig: {task_type} ({crep})")
            return {"status": "skip", "reason": "low_crep"}
        url = f"http://{service}:8000/process"
        resp = requests.post(url, json=sigillin_event['data'])
        return resp.json()
