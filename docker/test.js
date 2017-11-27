const deployBranch = require('./deployBranch');

(async () => {
  await deployBranch({
    owner: 'overture-stack',
    name: 'persona',
    branch: 'test-2',
  });
})();
