"""Basic plotting utilities for CREP data."""

from typing import Sequence
import plotly.graph_objs as go


def plot_crep_mandala(crep_values: Sequence[float], sigil_labels: Sequence[str] | None = None) -> "go.Figure":
    """Return a polar chart figure for CREP metrics.

    Parameters
    ----------
    crep_values:
        Sequence of CREP metric values.
    sigil_labels:
        Optional labels to annotate each value.
    """
    values = list(map(float, crep_values))
    angles = [i * 360 / len(values) for i in range(len(values))]
    fig = go.Figure(
        go.Scatterpolar(r=values, theta=angles, mode="lines+markers+text", text=sigil_labels or [])
    )
    fig.update_layout(polar=dict(radialaxis=dict(visible=True)))
    return fig

