mkdir -p /var/deploy
ssh-keyscan github.com >> /root/.ssh/known_hosts

echo "cloning git repos"

git clone git@github.com:NCI-GDC/signpost.git /var/deploy/signpost
git clone git@github.com:NCI-GDC/gdcapi.git /var/deploy/gdcapi

if [ -f /deploy-cache/virtual-envs/signpost/bin/activate ]; then
  mkdir -p /deploy-cache/virtual-envs/signpost
  virtualenv /deploy-cache/virtual-envs/signpost

fi
echo "installing signpost"
source /deploy-cache/virtual-envs/signpost/bin/activate
cd /var/deploy/signpost
pip install -r requirements.txt

