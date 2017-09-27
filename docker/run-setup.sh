echo 'creating ssh directory'
docker exec -d gdcapi mkdir -p /root/.ssh

if [ ! -f ./sshkey ]; then
  echo "no sshkey file found. Please put a private key with access to the repos at ./sshkey"
  exit 1;
fi

echo 'copying private deploy key'
docker cp sshkey gdcapi:/root/.ssh/id_rsa

echo 'copying setup script'
docker cp setup.sh gdcapi:/setup.sh

echo 'executing setup script in container'
docker exec -it -e DEBUG=y gdcapi bash /setup.sh
