const _ = require('lodash');
const express = require('express');
const router = express.Router();
const GITHUB_EVENTS = require('./constants/GITHUB_EVENTS');
const deployBranch = require('docker/deployBranch.js');

const projectName = 'overture-ego';
const acceptedGithubEvents = [
  GITHUB_EVENTS.push,
  GITHUB_EVENTS.pull_request,
  GITHUB_EVENTS.ping,
];

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
    if (githubEvent === GITHUB_EVENTS.push) {
      console.log('push received');
      const imageName = 'maven:3.5.2-ibmjava-8';
      const branch = _.last(req.body.ref.toString().split('/'));
      deployBranch({
        projectName: projectName,
        branchName: branch,
        dockerImage: imageName,
        port: '5000',
      });
      res.send({});
    } else {
      res.send({});
    }
    // res.send({});
  });

module.exports = router;
