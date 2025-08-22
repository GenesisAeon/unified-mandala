from __future__ import annotations

"""Basic neural activation helpers.

This module provides small utility functions to model a
minimal neural network.  It is intentionally lightweight
and serves as a placeholder for more sophisticated
consciousness simulations.
"""

from typing import Iterable, List
import math


def neuron_activation(inputs: Iterable[float], weights: Iterable[float], bias: float = 0.0) -> float:
    """Compute the sigmoid activation of a single neuron.

    Args:
        inputs: Incoming signal values.
        weights: Weights associated with each input.
        bias: Constant bias term added to the weighted sum.

    Returns:
        Activated neuron output in the range ``0`` to ``1``.
    """

    total = sum(i * w for i, w in zip(inputs, weights)) + bias
    return 1.0 / (1.0 + math.exp(-total))


def propagate_layer(
    inputs: List[float],
    weight_matrix: List[List[float]],
    biases: Iterable[float] | None = None,
) -> List[float]:
    """Propagate signals through a fully connected layer.

    Args:
        inputs: Values from the previous layer.
        weight_matrix: Matrix of weights where each sublist corresponds to a neuron.
        biases: Optional bias values for each neuron.

    Returns:
        List of neuron activations for the layer.
    """

    biases_list = list(biases) if biases is not None else [0.0] * len(weight_matrix)
    return [
        neuron_activation(inputs, weights, bias)
        for weights, bias in zip(weight_matrix, biases_list)
    ]


def simulate_network(
    inputs: List[float],
    layers: List[List[List[float]]],
    biases: List[Iterable[float]] | None = None,
) -> List[float]:
    """Simulate a feed-forward neural network.

    Args:
        inputs: Initial input vector.
        layers: Sequence of weight matrices for each layer.
        biases: Optional sequence of bias vectors.

    Returns:
        Output vector after sequential propagation.
    """

    bias_layers = biases if biases is not None else [None] * len(layers)
    activations = inputs
    for weight_matrix, bias_vec in zip(layers, bias_layers):
        activations = propagate_layer(activations, weight_matrix, bias_vec)
    return activations


__all__ = ["neuron_activation", "propagate_layer", "simulate_network"]
