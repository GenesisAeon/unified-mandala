# pyright: reportAttributeAccessIssue=false
import numpy as np  # type: ignore


def simulate_nullfield_wave(length: float = 1.0, duration: float = 1.0, dx: float = 0.01, dt: float = 0.005, c: float = 1.0):
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
    np.ndarray
        Array of shape (timesteps, points) representing the field over time.
    """
    nx = int(length / dx) + 1
    nt = int(duration / dt) + 1
    u = np.zeros((nt, nx))

    # initial condition: localized pulse in center
    mid = nx // 2
    u[0, mid] = 1.0

    # first time step using finite difference
    for i in range(1, nx - 1):
        u[1, i] = u[0, i] + 0.5 * (c * dt / dx) ** 2 * (u[0, i + 1] - 2 * u[0, i] + u[0, i - 1])

    coef = (c * dt / dx) ** 2
    for n in range(1, nt - 1):
        for i in range(1, nx - 1):
            u[n + 1, i] = 2 * u[n, i] - u[n - 1, i] + coef * (u[n, i + 1] - 2 * u[n, i] + u[n, i - 1])

    return u


if __name__ == "__main__":
    field = simulate_nullfield_wave()
    print(field.shape)
