from __future__ import annotations
from dataclasses import dataclass, field
from typing import List


@dataclass
class BinaryExistenceMatrix:
    """Simple binary state grid with nullmembrane threshold.

    Each cell is 0 or 1. During ``step`` the state of each cell
    changes based on the number of active neighbours and the
    ``nullmembrane`` threshold:

    * An active cell survives if neighbour count >= nullmembrane.
    * An inactive cell becomes active if neighbour count == nullmembrane.
    """

    width: int
    height: int
    nullmembrane: int = 1
    grid: List[List[int]] = field(init=False)

    def __post_init__(self) -> None:
        self.grid = [[0 for _ in range(self.width)] for _ in range(self.height)]

    def set_cell(self, x: int, y: int, value: int) -> None:
        self.grid[y][x] = 1 if value else 0

    def get_cell(self, x: int, y: int) -> int:
        return self.grid[y][x]

    def _neighbor_count(self, x: int, y: int) -> int:
        count = 0
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if 0 <= nx < self.width and 0 <= ny < self.height:
                    count += self.grid[ny][nx]
        return count

    def step(self) -> None:
        new_grid = [[0 for _ in range(self.width)] for _ in range(self.height)]
        for y in range(self.height):
            for x in range(self.width):
                neighbours = self._neighbor_count(x, y)
                if self.grid[y][x] == 1:
                    new_grid[y][x] = 1 if neighbours >= self.nullmembrane else 0
                else:
                    new_grid[y][x] = 1 if neighbours == self.nullmembrane else 0
        self.grid = new_grid
