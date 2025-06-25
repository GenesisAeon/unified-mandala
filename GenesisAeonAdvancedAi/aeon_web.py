"""Minimal Flask web API for AeonAgent."""

from flask import Flask, request, jsonify

from .aeon_agent import AeonAgent

app = Flask(__name__)
agent = AeonAgent()


@app.route("/aeon/act", methods=["POST"])
def act() -> "flask.Response":
    data = request.json.get("input")
    action, record = agent.act(data or [])
    return jsonify({"action": action, "record": record})


if __name__ == "__main__":
    app.run(debug=True)
