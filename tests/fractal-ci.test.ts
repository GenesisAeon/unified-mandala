test('fractal ci config exists', () => {
  const fs = require('fs');
  expect(fs.existsSync('deployment/fractal-ci/k8s.yaml')).toBe(true);
});
