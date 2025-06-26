import unittest

from GenesisAeonAdvancedAi.aeon_web import app


class TestAeonWeb(unittest.TestCase):
    def test_act_endpoint(self):
        with app.test_client() as client:
            res = client.post('/aeon/act', json={'input': [0.1]})
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertIn('action', data)
            self.assertIn('record', data)

    def test_summary_endpoint(self):
        with app.test_client() as client:
            client.post('/aeon/act', json={'input': [0.2]})
            res = client.get('/aeon/summary')
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertIsInstance(data, dict)

    def test_tail_endpoint(self):
        with app.test_client() as client:
            client.post('/aeon/act', json={'input': [0.3]})
            client.post('/aeon/act', json={'input': [0.4]})
            res = client.get('/aeon/tail?n=1')
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertIsInstance(data, list)
            self.assertEqual(len(data), 1)


if __name__ == '__main__':
    unittest.main()
