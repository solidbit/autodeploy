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

const pull = require('./pull');

const deployBranch = require('./deployBranch');

process.on('unhandledRejection', error => console.log('error', error.stack));

const image = 'maven:3.5.2-ibmjava-8';
// const image = 'openjdk:8u151-jdk';

(async () => {
  // await pull(image);

  deployBranch({
    projectName: 'overture-ego',
    branchName: 'feature/last-login-time',
    dockerImage: image,
    port: '8081',
  });
})();
