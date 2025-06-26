import unittest

from GenesisAeonAdvancedAi.mandala_visualizer import plot_crep_mandala

class TestMandalaVisualizer(unittest.TestCase):
    def test_returns_figure(self):
        fig = plot_crep_mandala([0.1, 0.5, 0.9], ["a", "b", "c"])
        self.assertEqual(fig.data[0].mode, "lines+markers+text")
        self.assertEqual(len(fig.data[0].r), 3)

if __name__ == "__main__":
    unittest.main()

