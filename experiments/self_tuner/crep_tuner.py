import yaml
import requests
import random
import pandas as pd

cfg = yaml.safe_load(open('tuner_config.yaml'))
# Q-Table initialisieren
Q = {svc: 0.5 for svc in cfg['services']}

for ep in range(cfg['episodes']):
    for svc in cfg['services']:
        crep = random.random()
        resp = requests.post(f"{cfg['scheduler_url']}/sigillin-event", json={
            'task_type': '',
            'crep_score': crep,
            'data': {}
        })
        success = 1 if resp.status_code == 200 else 0
        Q[svc] = Q[svc] + cfg['alpha'] * (success - Q[svc])
    new_thresh = {svc: float(Q[svc]) for svc in Q}
    base = yaml.safe_load(open('../orchestrator/pipeline_config.yaml'))
    base['crep_thresholds'].update(new_thresh)
    yaml.safe_dump(base, open('../orchestrator/pipeline_config.yaml', 'w'))
    print(f"Episode {ep}: {Q}")

pd.DataFrame.from_dict(Q, orient='index', columns=['threshold']).to_csv('final_thresholds.csv')
