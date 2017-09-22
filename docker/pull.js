const Docker = require('dockerode');
const docker = new Docker();

const pull = (repoTag, opts = {}) =>
  docker.pull(repoTag, opts, (err, stream) => {
    if (err) {
      console.error(err);
    }
    stream.pipe(process.stdout);
  });

pull('python:2.7.14');
