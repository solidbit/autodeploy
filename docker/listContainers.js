const Docker = require('dockerode');
const docker = new Docker();

const listContainers = async () => {
  return (await docker.listContainers()).map(containerInfo =>
    docker.getContainer(containerInfo),
  );
};

module.exports = listContainers;
