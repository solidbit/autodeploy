const _ = require('lodash');
const githubEvents = require('./githubEvents');
const GITHUB_EVENTS = _.keyBy(githubEvents, x => x);
module.exports = GITHUB_EVENTS;
