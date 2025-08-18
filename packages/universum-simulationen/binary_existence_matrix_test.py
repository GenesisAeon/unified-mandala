# pyright: reportAttributeAccessIssue=false
import os
import sys

sys.path.insert(0, os.path.join(os.getcwd(), "packages", "universum-simulationen"))
from binary_existence_matrix import BinaryExistenceMatrix


def test_birth_from_neighbor():
    bem = BinaryExistenceMatrix(3, 3, nullmembrane=1)
    bem.set_cell(0, 0, 1)
    bem.step()
    assert bem.get_cell(1, 1) == 1


def test_solitary_cell_dies():
    bem = BinaryExistenceMatrix(3, 3, nullmembrane=1)
    bem.set_cell(1, 1, 1)
    bem.step()
    assert bem.get_cell(1, 1) == 0
