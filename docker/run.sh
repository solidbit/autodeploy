mkdir -p deploy-caches/gdcapi

docker pull python:2.7.14

docker run \
  --mount type=bind,source="$(pwd)"/deploy-caches/gdcapi,target=/deploy-cache \
  --name python \
  --expose 5000 \
  -P \
  --rm -i -t python:2.7.14 bash