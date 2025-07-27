from fastapi import FastAPI, Request
import sqlite3

app = FastAPI()
conn = sqlite3.connect('ab_feedback.db')

@app.post('/feedback')
async def feedback(req: Request):
    data = await req.json()
    conn.execute(
        'INSERT INTO feedback(user, group, task, crep, liked) VALUES (?, ?, ?, ?, ?)',
        (
            data.get('user'),
            data.get('group'),
            data.get('task'),
            data.get('crep'),
            data.get('liked'),
        )
    )
    conn.commit()
    return {"status": "ok"}
