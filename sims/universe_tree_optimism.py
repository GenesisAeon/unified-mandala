"""Simulate and contrast tech- and society-optimistic branches for sustainable mobility.

This simple model assigns scores to two branches and compares overall sustainability.
"""
from dataclasses import dataclass
from typing import Dict


@dataclass
class BranchScenario:
    """Parameters representing an optimistic branch in the universe tree."""
    name: str
    tech_innovation: float
    social_policy: float
    adoption_rate: float

    def sustainability_score(self) -> float:
        """Combine factors into a single sustainability score."""
        return (
            (self.tech_innovation * 0.6 + self.social_policy * 0.4)
            * self.adoption_rate
        )


def simulate() -> Dict[str, float]:
    """Run the simulation for both branches and return their scores."""
    tech_branch = BranchScenario(
        name="tech",
        tech_innovation=0.9,
        social_policy=0.5,
        adoption_rate=0.7,
    )
    society_branch = BranchScenario(
        name="society",
        tech_innovation=0.6,
        social_policy=0.9,
        adoption_rate=0.8,
    )
    return {
        tech_branch.name: tech_branch.sustainability_score(),
        society_branch.name: society_branch.sustainability_score(),
    }


if __name__ == "__main__":
    scores = simulate()
    for name, score in scores.items():
        print(f"{name} branch sustainability score: {score:.2f}")
    diff = scores["tech"] - scores["society"]
    if diff > 0:
        print(f"Tech branch leads by {diff:.2f}")
    else:
        print(f"Society branch leads by {-diff:.2f}")
