const mkdirp = require('mkdirp');
const filenamify = require('filenamify');
const portfinder = require('portfinder');

const Docker = require('dockerode');
const docker = new Docker();

portfinder.basePort = 30000;

const DEPLOY_CACHE_ROOT = './deploy-caches/';
const projectName = 'gdcapi';
const cachePath = filenamify.path(`${DEPLOY_CACHE_ROOT}${projectName}`);

const runContainer = async ({ image, port, name }) => {
  mkdirp.sync(cachePath);
  const hostPort = await portfinder.getPortPromise();
  const container = await docker.createContainer({
    Image: image,
    name: name,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    Cmd: ['/bin/bash'],
    HostConfig: {
      Binds: [`${cachePath}:/deploy-cache`],
    },
    ExposedPorts: { [`${port}/tcp`]: {} },
    PortBindings: {
      [`${port}/tcp`]: [{ HostPort: hostPort.toString() }],
    },
  });

  await container.start();
};

const branchName = '1655-tar-stream-rest';
const containerName = `${branchName}-${projectName}`;

runContainer({ image: 'python:2.7.14', port: '5000', name: containerName });
