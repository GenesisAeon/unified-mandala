import math
import random
from dataclasses import dataclass, field
from typing import List

@dataclass
class Particle:
    x: float
    y: float
    vx: float
    vy: float
    mass: float
    kind: str = "matter"  # 'matter', 'antimatter', or 'gas'

    def distance_to(self, other: 'Particle') -> float:
        return math.hypot(self.x - other.x, self.y - other.y)

@dataclass
class Simulation:
    particles: List[Particle] = field(default_factory=list)
    G: float = 1.0
    collision_radius: float = 0.1

    def step(self, dt: float) -> None:
        forces = [(0.0, 0.0) for _ in self.particles]
        # Gravitational interaction
        for i, a in enumerate(self.particles):
            for j, b in enumerate(self.particles[i+1:], start=i+1):
                dx = b.x - a.x
                dy = b.y - a.y
                r2 = dx*dx + dy*dy + 1e-6
                r = math.sqrt(r2)
                f = self.G * a.mass * b.mass / r2
                fx = f * dx / r
                fy = f * dy / r
                forces[i] = (forces[i][0] + fx, forces[i][1] + fy)
                forces[j] = (forces[j][0] - fx, forces[j][1] - fy)

        # Update velocities and positions
        for p, (fx, fy) in zip(self.particles, forces):
            p.vx += fx / p.mass * dt
            p.vy += fy / p.mass * dt
        for p in self.particles:
            p.x += p.vx * dt
            p.y += p.vy * dt

        self.handle_collisions()

    def handle_collisions(self) -> None:
        new_particles: List[Particle] = []
        survived = []
        for i, a in enumerate(self.particles):
            collided = False
            for j, b in enumerate(self.particles[i+1:], start=i+1):
                if a.distance_to(b) < self.collision_radius:
                    energy = (a.mass + b.mass) * 1  # c^2 = 1 for simplicity
                    # Convert to gas particle with energy as mass
                    new_particles.append(Particle(a.x, a.y, 0, 0, energy, kind="gas"))
                    collided = True
                    b.mass = 0
            if not collided and a.mass > 0:
                survived.append(a)
        self.particles = survived + new_particles

    def add_random_particles(self, n: int) -> None:
        for _ in range(n):
            self.particles.append(
                Particle(
                    x=random.uniform(-1, 1),
                    y=random.uniform(-1, 1),
                    vx=random.uniform(-0.1, 0.1),
                    vy=random.uniform(-0.1, 0.1),
                    mass=random.uniform(0.5, 1.5),
                )
            )

if __name__ == "__main__":
    sim = Simulation()
    sim.add_random_particles(10)
    for step in range(100):
        sim.step(0.05)
    for p in sim.particles:
        print(f"{p.kind}: pos=({p.x:.2f},{p.y:.2f}) mass={p.mass:.2f}")
