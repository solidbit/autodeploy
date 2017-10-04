// const getContainer = require('./getContainer');
// const setupContainer = require('./setupContainer');
// const runContainer = require('./runContainer');

// (async () => {
//   // these would be passed in
//   const projectName = 'gdcapi';
//   const branchName = '1655-tar-stream-rest';
//   const containerName = `${branchName}--${projectName}`;

//   const container = await getContainer({
//     image: 'python:2.7.14',
//     port: '5000',
//     containerName,
//     projectName,
//   });

//   await setupContainer(container, branchName);
//   await runContainer(container);
// })();

const deployBranch = require('./deployBranch');

(async () => {
  deployBranch({
    projectName: 'gdcapi',
    branchName: '1655-tar-stream-rest',
    dockerImage: 'python:2.7.14',
    port: '5000',
  });
})();
