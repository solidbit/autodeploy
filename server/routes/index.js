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
  const matchingContainer = getContainerByName(
    containers,
    potentialContainerName,
  );

  return matchingContainer;
};

const dockerProxy = proxy(
  (pathname, req) => {
    console.log(
      'getContainerByHostname(instance.containers, req.hostname)',
      getContainerByHostname(instance.containers, req.hostname),
    );
    return !!getContainerByHostname(instance.containers, req.hostname);
  },
  {
    target: 'http://placeholder/',
    router: req => {
      const matchingContainer = getContainerByHostname(
        instance.containers,
        req.hostname,
      );

      if (matchingContainer) {
        const containerPort = matchingContainer.id.Ports[0].PublicPort;
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

router.use('/api/', require('./api/'));

const { getSubdomain } = require('tldjs');

router.get('/test', async (req, res) => {
  const hostname = req.hostname;
  const subdomain = getSubdomain(hostname);
  const potentialInstanceName = subdomain.split('.')[0];
  const matchingContainer = _.find(await listContainers(), x =>
    x.id.Names.includes(`/${potentialInstanceName}`),
  );

  res.send(matchingContainer);
});

module.exports = router;
