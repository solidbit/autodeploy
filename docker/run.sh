docker run \
  --mount type=bind,source="$(pwd)"/deploy-caches/prj1,target=/deploy-cache \
  --name python \
  --rm -i -t python:2.7.14 bash