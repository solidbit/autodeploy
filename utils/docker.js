const hostname = process.env.HOST_NAME || 'localhost:3000';

function getComposeProjectName({ owner, name, branch }) {
  return `${owner}${name}${branch}`.replace(/[-_]/g, '');
}

function getApiContainerName(opts) {
  return `${getComposeProjectName(opts)}_api_1`;
}

function getPreviewLink({ containerName, ...opts }) {
  const container = `${containerName || getApiContainerName(opts)}`;
  return process.env.USE_SUBDOMAIN
    ? `http://${container}.${hostname}`
    : `http://${hostname}/preview/${container}`;
}

module.exports = {
  getComposeProjectName,
  getApiContainerName,
  getPreviewLink,
};
