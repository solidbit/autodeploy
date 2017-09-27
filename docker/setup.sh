#!/bin/bash

test -z "$DEBUG" || set -x

mkdir -p /var/deploy
ssh-keyscan github.com >> /root/.ssh/known_hosts

echo "cloning git repos"

git clone git@github.com:NCI-GDC/signpost.git /var/deploy/signpost
git clone git@github.com:NCI-GDC/gdcapi.git /var/deploy/gdcapi

if [ ! -f /deploy-cache/virtual-envs/signpost/bin/activate ]; then
  echo "creating virtualenv for signpost"
  mkdir -p /deploy-cache/virtual-envs/signpost
  virtualenv /deploy-cache/virtual-envs/signpost
fi

echo "installing dependencies for signpost"
source /deploy-cache/virtual-envs/signpost/bin/activate
cd /var/deploy/signpost
pip install -r requirements.txt
echo "installing python-daemon"
pip install python-daemon

echo "running signpost"
python - <<-EOF
import daemon
from signpost import Signpost

with daemon.DaemonContext():
  Signpost({"driver": "inmemory", "layers": ["validator"]}).run(host="localhost", port=8000)
EOF

if [ ! -f /deploy-cache/virtual-envs/gdcapi/bin/activate ]; then
  echo "creating virtualenv for gdcapi"
  mkdir -p /deploy-cache/virtual-envs/gdcapi
  virtualenv /deploy-cache/virtual-envs/gdcapi
fi

echo "installing dependencies for gdcapi (this might take a while...)"
source /deploy-cache/virtual-envs/gdcapi/bin/activate
cd /var/deploy/gdcapi
pip install -r requirements.txt
echo "installing missing deps from requirements.txt"
pip install pyasn1
pip install mock
pip install python-daemon

echo "running gdcapi"
GDC_FAKE_AUTH=true GDC_API_PORT=5000 GDC_FAKE_DOWNLOAD=True GDC_ES_HOST=142.1.177.42 GDC_API_HOST=0.0.0.0 ES_CASE_INDEX=case_centric ES_GENE_INDEX=gene_centric ES_SSM_INDEX=ssm_centric ES_SSM_OCC_INDEX=ssm_occurrence_centric GDC_ES_INDEX=gdc_from_graph python run.py