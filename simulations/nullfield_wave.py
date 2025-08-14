# pyright: reportAttributeAccessIssue=false
import numpy as np  # type: ignore


def simulate_nullfield_wave(
    length: float = 1.0,
    duration: float = 1.0,
    dx: float = 0.01,
    dt: float = 0.005,
    c: float = 1.0,
    track_progress: bool = False,
    debug: bool = False,
    amplitude_limit: float = 10.0,
):
    """Simulate a 1D wave equation on a 'null field'.

    Parameters
    ----------
    length: float
        Physical length of the domain.
    duration: float
        Time to simulate.
    dx: float
        Spatial resolution.
    dt: float
        Time step size.
    c: float
        Wave propagation speed.

    Returns
    -------
    np.ndarray or Tuple[np.ndarray, Dict[str, List[float]]]
        Field values over time. If ``track_progress`` is True, a tuple of the
        field array and a metrics dictionary is returned.
    """
    nx = int(length / dx) + 1
    nt = int(duration / dt) + 1
    u = np.zeros((nt, nx))

    metrics = {"max_amplitude": [], "energy": []} if track_progress else None

    # initial condition: localized pulse in center
    mid = nx // 2
    u[0, mid] = 1.0

    # first time step using finite difference
    for i in range(1, nx - 1):
        u[1, i] = u[0, i] + 0.5 * (c * dt / dx) ** 2 * (u[0, i + 1] - 2 * u[0, i] + u[0, i - 1])

    coef = (c * dt / dx) ** 2
    for n in range(1, nt - 1):
        for i in range(1, nx - 1):
            u[n + 1, i] = 2 * u[n, i] - u[n - 1, i] + coef * (
                u[n, i + 1] - 2 * u[n, i] + u[n, i - 1]
            )

        if track_progress and metrics is not None:
            max_amp = float(np.max(np.abs(u[n])))
            energy = float(np.sum(u[n] ** 2))
            metrics["max_amplitude"].append(max_amp)
            metrics["energy"].append(energy)

        if debug:
            if np.isnan(u[n]).any() or np.isinf(u[n]).any() or (
                track_progress and metrics is not None and metrics["max_amplitude"][-1] > amplitude_limit
            ):
                raise ValueError(f"Simulation diverged at step {n}")

    if track_progress and metrics is not None:
        return u, metrics
    return u


if __name__ == "__main__":
    field = simulate_nullfield_wave()
    print(field.shape)
