import express from 'express';
import { DatasetRegistry } from '../packages/datasets/DatasetRegistry';
import { ConsentRegistry } from '../packages/personhood/ConsentRegistry';

const app = express();
app.use(express.json());

app.post('/consent', (req, res) => {
  const { personId } = req.body;
  if (!personId) {
    return res.status(400).json({ error: 'personId required' });
  }
  ConsentRegistry.grant(personId);
  res.json({ status: 'granted' });
});

app.delete('/consent/:personId', (req, res) => {
  ConsentRegistry.revoke(req.params.personId);
  res.json({ status: 'revoked' });
});

app.post('/datasets', (req, res) => {
  const { name, personId } = req.body;
  if (!name || !personId) {
    return res.status(400).json({ error: 'name and personId required' });
  }
  try {
    DatasetRegistry.registerDataset(name, personId);
    res.status(201).json({ status: 'registered' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/datasets/:name/versions', (req, res) => {
  const { version, personId } = req.body;
  const { name } = req.params;
  if (!version || !personId) {
    return res.status(400).json({ error: 'version and personId required' });
  }
  try {
    DatasetRegistry.addVersion(name, version, personId);
    res.status(201).json({ status: 'version added' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/datasets/:name/versions/:version/splits', (req, res) => {
  const { splitName, uri, personId } = req.body;
  const { name, version } = req.params;
  if (!splitName || !uri || !personId) {
    return res.status(400).json({ error: 'splitName, uri and personId required' });
  }
  try {
    DatasetRegistry.addSplit(name, version, splitName, uri, personId);
    res.status(201).json({ status: 'split added' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/datasets/:name/versions/:version/artifacts', (req, res) => {
  const { artifactName, uri, personId } = req.body;
  const { name, version } = req.params;
  if (!artifactName || !uri || !personId) {
    return res.status(400).json({ error: 'artifactName, uri and personId required' });
  }
  try {
    DatasetRegistry.addArtifact(name, version, artifactName, uri, personId);
    res.status(201).json({ status: 'artifact added' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/datasets/:name', (req, res) => {
  const ds = DatasetRegistry.getDataset(req.params.name);
  if (!ds) {
    return res.status(404).json({ error: 'dataset not found' });
  }
  res.json(ds);
});

app.get('/datasets/:name/versions/:version', (req, res) => {
  try {
    const ver = DatasetRegistry.getVersion(req.params.name, req.params.version);
    res.json(ver);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => {
  console.log(`Dataset API server listening on ${port}`);
});
