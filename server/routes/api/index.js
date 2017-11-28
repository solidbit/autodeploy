const express = require('express');
const router = express.Router();
const { getPreviewLink } = require('utils/docker');

const listContainers = require('docker/listContainers');

router.use('/hooks', require('./hooks'));

router.get('/containers', async (req, res) => {
  const containers = await listContainers();
  res.send(containers);
});

router.get('/deploys', async (req, res) => {
  const containers = await listContainers();
  const containerInfo = containers
    .filter(container => container.id.Names[0].match(/_api_\d+$/))
    .map(container => {
      return {
        status: container.id.Status,
        state: container.id.State,
        url: getPreviewLink({ containerName: container.id.Names[0].slice(1) }),
      };
    });
  res.send(containerInfo);
});

module.exports = router;
