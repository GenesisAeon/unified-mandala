import unittest
from trikaya import trikaya_state


class TestTrikaya(unittest.TestCase):
    def test_mapping(self):
        self.assertEqual(trikaya_state(1), "PRÄSENZ")
        self.assertEqual(trikaya_state(0), "LEERE")
        self.assertEqual(trikaya_state(-1), "AUFLÖSUNG")
        self.assertEqual(trikaya_state(2), "UNBEKANNT")


if __name__ == "__main__":
    unittest.main()

