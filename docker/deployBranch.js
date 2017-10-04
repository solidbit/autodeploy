const getContainer = require('./getContainer');
const setupContainer = require('./setupContainer');
const runContainer = require('./runContainer');

const deployBranch = async ({ projectName, branchName, dockerImage, port }) => {
  const containerName = `${branchName}--${projectName}`;
  const container = await getContainer({
    image: dockerImage,
    port: port,
    containerName,
    projectName,
  });
  await setupContainer(container, branchName);
  await runContainer(container);
};

module.exports = deployBranch;
