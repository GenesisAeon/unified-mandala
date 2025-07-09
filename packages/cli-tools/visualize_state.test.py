import unittest
from visualize_state import visualize

class TestVisualizeState(unittest.TestCase):
    def test_visualize_returns_figure(self):
        data = [{
            'timestamp': '2024-01-01T00:00:00',
            'C': 1,
            'R': 1,
            'E': 1,
            'P': 1
        }]
        fig = visualize(data)
        self.assertEqual(fig.axes[0].lines[0].get_label(), 'C')

if __name__ == '__main__':
    unittest.main()
