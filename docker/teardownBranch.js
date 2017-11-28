const portfinder = require('portfinder');
const spawn = require('./spawn');
const mkdirp = require('mkdirp-promise');
const { getComposeProjectName } = require('utils/docker');
portfinder.basePort = 30000;

const teardownBranch = async ({ owner, name, branch }) => {
  const apiPort = await portfinder.getPortPromise();
  await mkdirp(`./repos/${owner}`);

  const composeProjectName = getComposeProjectName({ owner, name, branch });
  return spawn(`./docker/teardown.sh`, {
    cdw: './',
    env: {
      API_HOST_PORT: apiPort,
      BRANCH: branch,
      OWNER: owner,
      NAME: name,
      COMPOSE_PROJECT_NAME: composeProjectName,
    },
  });
};

module.exports = teardownBranch;
