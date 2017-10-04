const Docker = require('dockerode');
const docker = new Docker();

const execPromise = (container, execOptions, { stdout, stderr } = {}) =>
  new Promise((resolve, reject) => {
    container.exec(
      Object.assign(
        {
          AttachStdout: true,
          AttachStderr: true,
        },
        execOptions,
      ),
      (err, execContainer) => {
        err && console.error('err', err);
        execContainer.start((err, stream) => {
          err && console.error('err', err);
          const chunks = [];
          stream.on('end', () => {
            var buffer = Buffer.concat(chunks).toString('utf8');
            resolve(buffer);
          });
          stream.on('error', err => {
            console.error('err', err);
            reject(err);
          });
          if (stdout || stderr) {
            docker.modem.demuxStream(stream, stdout, stderr);
          } else {
            stream.on('data', chunk => chunks.push(chunk));
          }
        });
      },
    );
  });

module.exports = execPromise;
