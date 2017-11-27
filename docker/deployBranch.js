const portfinder = require('portfinder');
const spawn = require('child_process').spawn;
const mkdirp = require('mkdirp-promise');

portfinder.basePort = 30000;

const deployBranch = async ({ owner, name, branch }) => {
  const apiPort = await portfinder.getPortPromise();
  await mkdirp(`./repos/${owner}`);

  const composeProjectName = `${owner}${name}${branch}`.replace(/[-_]/g, '');
  return new Promise(function(resolve, reject) {
    const setup = spawn(`./docker/setup.sh`, [], {
      cdw: './',
      env: {
        API_HOST_PORT: apiPort,
        BRANCH: branch,
        OWNER: owner,
        NAME: name,
        COMPOSE_PROJECT_NAME: composeProjectName,
      },
    });

    setup.stdout.on('data', function(data) {
      console.log('stdout: ' + data.toString());
    });

    setup.stderr.on('data', function(data) {
      console.log('stderr: ' + data.toString());
    });

    setup.on('exit', function(code) {
      console.log('child process exited with code ' + code.toString());
      resolve();
    });
  });
};

module.exports = deployBranch;
