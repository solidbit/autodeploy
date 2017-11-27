#!/bin/bash

test -z "$DEBUG" || set -x

mkdir -p /var/deploy
ssh-keyscan github.com >> /root/.ssh/known_hosts

echo "cloning git repos"

git clone git@github.com:overture-stack/ego.git -b $BRANCH /var/deploy/overture

mvn clean package
