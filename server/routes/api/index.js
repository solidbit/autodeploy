const express = require('express');
const router = express.Router();

const listContainers = require('docker/listContainers');

const projectName = 'gdcapi';
const hostname = process.env.HOST_NAME || 'deploys.cheapsteak.net';
router.use('/hooks', require('./hooks'));

router.get('/containers', async (req, res) => {
  const containers = await listContainers();
  res.send(containers);
});

router.get('/deploys', async (req, res) => {
  const containers = await listContainers();
  const containerInfo = containers.map(container => ({
    status: container.id.Status,
    state: container.id.State,
    url: `http://${container.id.Names[0].slice(1)}--${projectName}.${hostname}`,
  }));
  res.send(containerInfo);
});

module.exports = router;
