const _ = require('lodash');
const express = require('express');
const router = express.Router();
const listContainers = require('docker/listContainers');
const proxy = require('http-proxy-middleware');

const instance = {
  container: [],
};

const updateContainers = () =>
  listContainers().then(data => {
    instance.containers = data;
  });

// update contaienrs list every 5 seconds
// because proxy middleware return value has to be sync
setInterval(updateContainers, 5000);
updateContainers();

const getContainerByName = (containers, name) => {
  return name ? _.find(containers, x => x.id.Names.includes(`/${name}`)) : null;
};

const getContainerByHostname = (containers, hostname) => {
  const subdomain = getSubdomain(hostname);
  const potentialContainerName = subdomain && subdomain.split('.')[0];
  const matchingContaienr = getContainerByName(
    containers,
    potentialContainerName,
  );

  return matchingContaienr;
};

const dockerProxy = proxy(
  (pathname, req) => {
    return !!getContainerByHostname(instance.containers, req.hostname);
  },
  {
    target: 'http://placeholder/',
    router: req => {
      const matchingContaienr = getContainerByHostname(
        instance.containers,
        req.hostname,
      );

      if (matchingContaienr) {
        const containerPort = matchingContaienr.id.Ports[0].PublicPort;
        const proxyTarget = `${req.protocol}://localhost:${containerPort}`;
        console.log(proxyTarget);
        return proxyTarget;
      } else {
        console.error('no matching container found');
      }
    },
  },
);

router.use('/', dockerProxy);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api/hooks', require('./api/hooks'));

router.get('/api/deploys', async (req, res) => {
  const containers = await listContainers();
  res.send(containers);
});

const { getSubdomain } = require('tldjs');

router.get('/test', async (req, res) => {
  const hostname = req.hostname;
  const subdomain = getSubdomain(hostname);
  const potentialInstanceName = subdomain.split('.')[0];
  const matchingContaienr = _.find(await listContainers(), x =>
    x.id.Names.includes(`/${potentialInstanceName}`),
  );

  res.send(matchingContaienr);
});

module.exports = router;
