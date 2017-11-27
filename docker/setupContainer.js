const fs = require('fs');
const privateKey = fs.readFileSync(__dirname + '/sshkey', 'utf8');
const setupScript = fs.readFileSync(__dirname + '/setup.sh', 'utf8');
const runScript = fs.readFileSync(__dirname + '/run.sh', 'utf8');

const execPromise = require('./execPromise');

const setupContainer = async (container, branchName) => {
  // TODO: clone outside the container, copy in, so container doesn't need to install git
  console.log('install git');
  await execPromise(
    container,
    {
      Cmd: ['bash', '-c', 'apt-get install git -y'],
      AttachStdout: true,
      AttachStderr: true,
    },
    {
      stdout: process.stdout,
      stderr: process.stderr,
    },
  );

  // await execPromise(
  //   container,
  //   {
  //     Cmd: ['bash', '-c', 'apt-get install software-properties-common'],
  //     AttachStdout: true,
  //     AttachStderr: true,
  //   },
  //   {
  //     stdout: process.stdout,
  //     stderr: process.stderr,
  //   },
  // );

  // await execPromise(
  //   container,
  //   {
  //     Cmd: ['bash', '-c', 'apt-get install software-properties-common'],
  //     AttachStdout: true,
  //     AttachStderr: true,
  //   },
  //   {
  //     stdout: process.stdout,
  //     stderr: process.stderr,
  //   },
  // );

  // await execPromise(
  //   container,
  //   {
  //     Cmd: ['bash', '-c', 'apt-add-repository universe'],
  //     AttachStdout: true,
  //     AttachStderr: true,
  //   },
  //   {
  //     stdout: process.stdout,
  //     stderr: process.stderr,
  //   },
  // );

  // await execPromise(
  //   container,
  //   {
  //     Cmd: ['bash', '-c', 'apt-get update'],
  //     AttachStdout: true,
  //     AttachStderr: true,
  //   },
  //   {
  //     stdout: process.stdout,
  //     stderr: process.stderr,
  //   },
  // );

  // await execPromise(
  //   container,
  //   {
  //     Cmd: ['bash', '-c', 'apt-get install maven -y'],
  //     AttachStdout: true,
  //     AttachStderr: true,
  //   },
  //   {
  //     stdout: process.stdout,
  //     stderr: process.stderr,
  //   },
  // );

  console.log('creating /root/.ssh');
  await execPromise(container, { Cmd: ['mkdir', '-p', '/root/.ssh'] });

  console.log('copying key to ~/.ssh');
  await execPromise(container, {
    Cmd: [
      'bash',
      '-c',
      ` echo '${privateKey.replace(/\n/g, '\n')}' > /root/.ssh/id_rsa`,
    ],
  });

  console.log('changing permissions on key to 400');
  await execPromise(container, {
    Cmd: ['chmod', '400', `/root/.ssh/id_rsa`],
  });

  console.log('copying setup script');
  await execPromise(container, {
    Cmd: [
      'bash',
      '-c',
      ` echo '${setupScript.replace(/\n/g, '\n')}' > /root/setup.sh`,
    ],
  });

  console.log('copying run script');
  await execPromise(container, {
    Cmd: [
      'bash',
      '-c',
      ` echo '${runScript.replace(/\n/g, '\n')}' > /root/run.sh`,
    ],
  });

  console.log('executing setup script');
  await execPromise(
    container,
    {
      Cmd: ['bash', '/root/setup.sh'],
      Env: [`BRANCH=${branchName}`],
      AttachStdout: true,
      AttachStderr: true,
    },
    {
      stdout: process.stdout,
      stderr: process.stderr,
    },
  );
};

module.exports = setupContainer;
