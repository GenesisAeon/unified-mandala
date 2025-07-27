test('pantheon deployment config exists', () => {
  const fs = require('fs');
  expect(fs.existsSync('deployment/pantheon/deployment.yaml')).toBe(true);
});
