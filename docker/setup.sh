mkdir -p /var/deploy
ssh-keyscan github.com >> /root/.ssh/known_hosts

echo "cloning git repos"

git clone git@github.com:NCI-GDC/signpost.git /var/deploy/signpost
git clone git@github.com:NCI-GDC/gdcapi.git /var/deploy/gdcapi

echo "installing signpost"
cd /var/deploy/signpost
