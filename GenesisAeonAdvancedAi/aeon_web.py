"""Minimal Flask web API for AeonAgent."""

from flask import Flask, request, jsonify

from .aeon_agent import AeonAgent
from .memory_store import summarize_entries

app = Flask(__name__)
agent = AeonAgent()


@app.route("/aeon/act", methods=["POST"])
def act() -> "flask.Response":
    data = request.json.get("input")
    action, record = agent.act(data or [])
    return jsonify({"action": action, "record": record})


@app.route("/aeon/summary", methods=["GET"])
def summary() -> "flask.Response":
    """Return a summary of the agent's memory."""
    data = summarize_entries(agent.memory)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
