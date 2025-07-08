import unittest

from GenesisAeonAdvancedAi.aeon_processor import fraktal_feedback_graph
from GenesisAeonAdvancedAi.feedback_graph import visualize_feedback_graph
import plotly.graph_objs as go


class TestFraktalFeedbackGraph(unittest.TestCase):
    def test_basic_graph_structure(self):
        graph = fraktal_feedback_graph([0.1, 0.2, 0.3], depth=3)
        self.assertIn("nodes", graph)
        self.assertIn("edges", graph)
        self.assertGreaterEqual(len(graph["nodes"]), 1)
        self.assertIn("trikaya_state", graph["nodes"][0])

    def test_deep_recursion_limit(self):
        graph = fraktal_feedback_graph([0.1] * 5, depth=5)
        self.assertLessEqual(len(graph["nodes"]), 5)
        if len(graph["nodes"]) > 1:
            self.assertEqual(len(graph["edges"]), len(graph["nodes"]) - 1)

    def test_empty_input(self):
        graph = fraktal_feedback_graph([], depth=2)
        self.assertEqual(len(graph["nodes"]), 1)
        self.assertIn("trikaya_state", graph["nodes"][0])

    def test_zero_depth(self):
        graph = fraktal_feedback_graph([0.1], depth=0)
        self.assertEqual(graph["nodes"], [])
        self.assertEqual(graph["edges"], [])

    def test_visualization(self):
        graph = fraktal_feedback_graph([0.2, 0.3], depth=2)
        fig = visualize_feedback_graph(graph)
        self.assertIsInstance(fig, go.Figure)
        self.assertGreaterEqual(len(fig.data), 1)


if __name__ == "__main__":
    unittest.main()
