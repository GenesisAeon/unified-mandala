"""Minimal Flask web API for AeonAgent."""

from flask import Flask, request, jsonify

from .aeon_agent import AeonAgent
from .memory_store import summarize_entries, tail_results

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


@app.route("/aeon/tail", methods=["GET"])
def tail() -> "flask.Response":
    """Return the last ``n`` memory entries."""
    try:
        n = int(request.args.get("n", "10"))
    except ValueError:
        n = 10
    entries = agent.memory[-n:]
    return jsonify(entries)


if __name__ == "__main__":
    app.run(debug=True)
