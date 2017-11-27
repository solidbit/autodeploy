const _ = require('lodash');
const express = require('express');
const router = express.Router();
const listContainers = require('docker/listContainers');
const proxy = require('http-proxy-middleware');
const { getSubdomain } = require('tldjs');

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
  const subdomain = hostname.split('.')[0];
  const matchingContainer = getContainerByName(containers, subdomain);
  return matchingContainer;
};

const dockerProxy = proxy(
  (pathname, req) => {
    return (
      !!getContainerByHostname(instance.containers, req.hostname) ||
      !!getContainerByName(
        instance.containers,
        (req.url.match(/^\/(preview\/)?([^\/]*)/) || [])[2],
      )
    );
  },
  {
    target: 'http://placeholder/',
    router: req => {
      const match = req.url.match(/^\/(preview\/)?([^\/]*)(\/.*)?/) || [];

      const matchingContainer =
        getContainerByHostname(instance.containers, req.hostname) ||
        getContainerByName(instance.containers, match[2]);

      if (matchingContainer) {
        const containerPort = matchingContainer.id.Ports[0].PublicPort;
        const proxyTarget = `${req.protocol}://localhost:${containerPort}${match[3] ||
          ''}`;
        return proxyTarget;
      } else {
        console.error('no matching container found');
      }
    },
  },
);

router.use('/', dockerProxy);
router.use(/\/preview\/.*/, dockerProxy);

module.exports = router;
