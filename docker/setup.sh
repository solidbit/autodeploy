#!/bin/bash
# ENV Variables
# $OWNER
# $NAME
# $BRANCH
# $API_HOST_PORT
# $COMPOSE_PROJECT_NAME

test -z "$DEBUG" || set -x

cd "repos/$OWNER"
if [ ! -d "$NAME" ]; then
  git clone "git@github.com:$OWNER/$NAME.git"
fi

cd "$NAME"

git fetch
git checkout "$BRANCH"
git reset --hard origin/"$BRANCH"

docker-compose up --build -d
