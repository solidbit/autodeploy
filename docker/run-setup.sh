# docker run -it python:2.7.14 /bin/bash

docker exec -d python mkdir -p /root/.ssh
docker exec -d python mkdir -p /deploy-cache
docker cp sshkey python:/root/.ssh/id_rsa
docker cp setup.sh python:/setup.sh
docker exec -d python sh -c 'sh /setup.sh'
