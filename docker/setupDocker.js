const fs = require('fs');
const privateKey = fs.readFileSync(__dirname + '/sshkey', 'utf8');
const setupScript = fs.readFileSync(__dirname + '/setup.sh', 'utf8');

const setupContainer = async (container, branchName) => {
  console.log('creating /root/.ssh');
  await container.exec({
    Cmd: ['mkdir', '-p', '/root/.ssh'],
  });

  console.log('writing key to ~/.ssh');
  await container.exec({
    Cmd: ['echo', privateKey, '>', '/root/.ssh/id_rsa'],
  });

  console.log('writing setup script');
  await container.exec({
    Cmd: ['echo', setupScript, '>', '/root/setup.sh'],
  });

  console.log('executing setup script');
  await container.exec(
    {
      Cmd: ['sh', '/root/setup.sh'],
      Env: [`BRANCH=${branchName}`],
      AttachStdout: true,
      AttachStderr: true,
    },
    (err, exec) => {
      err && console.error(err);
      exec.start({ hijack: true, stdin: false }, function(err, stream) {
        docker.modem.demuxStream(stream, process.stdout, process.stderr);
      });
    },
  );
};

const Docker = require('dockerode');
const docker = new Docker();
const container = docker.getContainer('gdcapi');
const branchName = '1655-tar-stream-rest';
setupContainer(container, branchName);

module.exports = setupContainer;
