FROM mhart/alpine-node:latest

RUN mkdir -p /opt/app

WORKDIR /opt/app

# copy just the package.json/yarn.lock/package-lock.json and install dependencies for caching
COPY package.json yarn.lock ./
# if using npm instead of yarn
# COPY package.json package-lock.json ./

RUN NODE_ENV=production yarn --ignore-optional && \
  yarn autoclean --init && \
  yarn autoclean --force && \
  yarn cache clean
# if using npm instead of yarn
# RUN NODE_ENV=production npm --no-optional && \
#   npm install -g node-prune && \
#   node-prune && \
#   npm remove -g node-prune && \
#   npm cache clean --force


COPY . .

EXPOSE 3232

CMD yarn start
# if using npm instead of yarn
# CMD npm start