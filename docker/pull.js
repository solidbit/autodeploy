const Docker = require('dockerode');
const docker = new Docker();

const pull = (repoTag, opts = {}) =>
  new Promise((resolve, reject) =>
    docker.pull(repoTag, opts, (err, stream) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      stream.pipe(process.stdout);
      process.stdout.on('close', resolve);
    }),
  );

// pull('maven:3.5.2-ibmjava-8');

module.exports = pull;
