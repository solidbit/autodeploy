const mkdirp = require('mkdirp');
const filenamify = require('filenamify');
const portfinder = require('portfinder');

const Docker = require('dockerode');
const docker = new Docker();

portfinder.basePort = 30000;

const DEPLOY_CACHE_ROOT = './deploy-caches/';

const getContainer = async ({ image, port, containerName, projectName }) => {
  const cachePath = filenamify.path(`${DEPLOY_CACHE_ROOT}${projectName}`);
  const containers = await docker.listContainers();
  const runningContainer = containers.find(container =>
    container.Names.includes(`/${containerName}`),
  );

  if (runningContainer.State === 'running') {
    return docker.getContainer(runningContainer.Id);
  }

  mkdirp.sync(cachePath);
  const hostPort = await portfinder.getPortPromise();
  const container = await docker.createContainer({
    Image: image,
    name: containerName,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    Cmd: ['/bin/bash'],
    HostConfig: {
      Binds: [`${cachePath}:/deploy-cache`],
      PortBindings: {
        [`${port}/tcp`]: [{ HostPort: hostPort.toString() }],
      },
    },
    ExposedPorts: { [`${port}/tcp`]: {} },
  });
  await container.start();
  return container;
};

module.exports = getContainer;
