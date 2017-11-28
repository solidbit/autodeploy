const _ = require('lodash');
const express = require('express');
const router = express.Router();
const GITHUB_EVENTS = require('./constants/GITHUB_EVENTS');
const deployBranch = require('docker/deployBranch.js');
const teardownBranch = require('docker/teardownBranch');
const GitHub = require('github-api');
const { getPreviewLink } = require('utils/docker');
var github = new GitHub({
  token: process.env.GITHUB_TOKEN,
});

const acceptedGithubEvents = [GITHUB_EVENTS.push, GITHUB_EVENTS.pull_request];

router
  .get('/', function(req, res, next) {
    res.send({ msg: 'test' });
  })
  .post('/', function(req, res, next) {
    const githubEvent = req.header('X-GitHub-Event');
    if (!acceptedGithubEvents.includes(githubEvent)) {
      res.status(400).send({
        message: `Invalid or missing value on header "X-GitHub-Event". Must be one of ${JSON.stringify(
          acceptedGithubEvents,
        )}`,
      });
      return;
    }
    const { action } = req.body;
    if (githubEvent === GITHUB_EVENTS.push) {
      const {
        deleted,
        ref,
        repository: { name, owner: { name: owner } },
      } = req.body;
      const branch = _.last(ref.toString().split('/'));
      if (deleted) {
        console.log('delete received');
        teardownBranch({ owner, name, branch });
      } else {
        console.log('push received');
        deployBranch({ owner, name, branch });
      }

      res.send({});
    } else if (
      githubEvent === GITHUB_EVENTS.pull_request &&
      action === 'opened'
    ) {
      const {
        pull_request: {
          head: { ref, repo: { name, owner: { login: owner } } },
          number,
        },
      } = req.body;
      console.log('pullrequest received');
      const branch = _.last(ref.toString().split('/'));
      const url = getPreviewLink({ owner, name, branch });
      const issues = github.getIssues(owner, name);
      issues.createIssueComment(number, url, function(err) {
        console.log('created issued', !!err);
      });

      res.send({});
    }
  });

module.exports = router;
