import unittest

from aeon_processor import fraktal_feedback_graph


class TestFraktalFeedbackGraph(unittest.TestCase):
    def test_graph_structure(self):
        graph = fraktal_feedback_graph([0.1, 0.2, 0.3], depth=2)
        self.assertIn("states", graph)
        self.assertIn("edges", graph)
        self.assertGreaterEqual(len(graph["states"]), 1)
        # check that edges connect sequential states
        if len(graph["states"]) > 1:
            self.assertEqual(
                graph["edges"],
                [{"from": i, "to": i + 1} for i in range(len(graph["states"]) - 1)],
            )


if __name__ == "__main__":
    unittest.main()
