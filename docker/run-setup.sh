# docker run -it python:2.7.14 /bin/bash

echo 'creating ssh directory'
docker exec -d python mkdir -p /root/.ssh

# mounting this via `mount` command instead
# docker exec -d python mkdir -p /deploy-cache

if [ ! -f ./sshkey ]; then
  echo "no sshkey file found. Please put a private key with access to the repos at ./sshkey"
  exit 1;
fi

echo 'copying private key'
docker cp sshkey python:/root/.ssh/id_rsa

echo 'copying setup script'
docker cp setup.sh python:/setup.sh


echo 'executing setup script in container'
docker exec -it -e DEBUG=y python bash /setup.sh
