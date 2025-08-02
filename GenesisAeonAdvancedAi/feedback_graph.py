"""Utilities to visualize fractal feedback graphs."""

from typing import Any, Dict

import plotly.graph_objects as go
from plotly.graph_objects import Figure


def visualize_feedback_graph(graph: Dict[str, Any]) -> Figure:
    """Return Plotly figure visualizing feedback graph."""
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    x_positions = list(range(len(nodes)))
    y_positions = [0] * len(nodes)
    labels = [n.get("trikaya_state", "") for n in nodes]

    edge_x: list[float] = []
    edge_y: list[float] = []
    for edge in edges:
        start = edge.get("from")
        end = edge.get("to")
        if start is None or end is None:
            continue
        edge_x += [x_positions[start], x_positions[end], None]
        edge_y += [y_positions[start], y_positions[end], None]

    fig = go.Figure()
    if edge_x:
        fig.add_trace(
            go.Scatter(
                x=edge_x,
                y=edge_y,
                mode="lines",
                line=dict(width=1, color="gray"),
                hoverinfo="none",
            )
        )
    fig.add_trace(
        go.Scatter(
            x=x_positions,
            y=y_positions,
            mode="markers+text",
            text=labels,
            textposition="top center",
        )
    )
    fig.update_layout(showlegend=False, xaxis=dict(visible=False), yaxis=dict(visible=False))
    return fig
