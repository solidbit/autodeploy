const getContainer = require('./getContainer');
const setupContainer = require('./setupContainer');

(async () => {
  // these would be passed in
  const projectName = 'gdcapi';
  const branchName = '1655-tar-stream-rest';
  const containerName = `${branchName}--${projectName}`;

  const container = await getContainer({
    image: 'python:2.7.14',
    port: '5000',
    containerName,
    projectName,
  });

  setupContainer(container, branchName);
})();
