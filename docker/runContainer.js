const Docker = require('dockerode');
const docker = new Docker();

const execPromise = require('./execPromise');
const ES_COLLAB = '142.1.177.42';

const runContainer = async (container, branchName) => {
  console.log('executing run script');
  const ES_HOST = process.env.ES_HOST || ES_COLLAB;
  await execPromise(
    container,
    {
      Cmd: ['bash', '/root/run.sh'],
      Env: [
        `GDC_FAKE_AUTH=true`,
        `GDC_API_PORT=5000`,
        `GDC_FAKE_DOWNLOAD=True`,
        `GDC_ES_HOST=${ES_HOST}`,
        `GDC_ES_PASS='Mm%F@W8=^j#a^Sq%'`,
        `GDC_API_HOST=0.0.0.0`,
        `ES_CASE_INDEX=case_centric`,
        `ES_GENE_INDEX=gene_centric`,
        `ES_SSM_INDEX=ssm_centric`,
        `ES_SSM_OCC_INDEX=ssm_occurrence_centric`,
        `GDC_ES_INDEX=gdc_from_graph`,
      ],
      AttachStdout: true,
      AttachStderr: true,
    },
    {
      stdout: process.stdout,
      stderr: process.stderr,
    },
  );
};

module.exports = runContainer;
