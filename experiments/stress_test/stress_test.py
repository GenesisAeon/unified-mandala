import asyncio
import aiohttp
import yaml
import random
import time

async def send_event(session, url, event):
    async with session.post(url, json=event) as resp:
        return await resp.text()

async def worker(name, config, metrics):
    url = config['target_url']
    types = config['event_types']
    end = time.time() + config['duration_sec']
    async with aiohttp.ClientSession() as session:  # type: ignore
        while time.time() < end:
            ev = {
                'task_type': random.choice(types),
                'crep_score': random.random(),
                'data': {'dummy': True}
            }
            start = time.time()
            try:
                await send_event(session, url, ev)
                latency = time.time() - start
                metrics['success'] += 1
                metrics['latencies'].append(latency)
            except Exception:
                metrics['fail'] += 1

async def main():
    with open('stress_config.yaml') as f:
        config = yaml.safe_load(f.read())
    metrics = {'success': 0, 'fail': 0, 'latencies': []}
    tasks = [asyncio.create_task(worker(f'w{i}', config, metrics)) for i in range(config['concurrency'])]
    await asyncio.gather(*tasks)
    print(f"Success: {metrics['success']}, Fail: {metrics['fail']}")
    lat = metrics['latencies']
    if lat:
        print(f"95th percentile latency: {sorted(lat)[int(0.95*len(lat))]:.3f}s")
    else:
        print("No latency data recorded")

if __name__ == '__main__':
    asyncio.run(main())
