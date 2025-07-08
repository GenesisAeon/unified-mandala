import unittest
from services.llm_commentary.index import generate_commentary


class TestCommentary(unittest.TestCase):
    def test_basic(self):
        text = generate_commentary({"symbol": "\u2600"})
        self.assertIn("Bright", text)

    def test_default(self):
        text = generate_commentary({})
        self.assertEqual(text, "Neutral state")


if __name__ == "__main__":
    unittest.main()
