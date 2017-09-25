docker run \
  --mount type=bind,source="$(pwd)"/deploy-caches/prj1,target=/deploy-cache \
  --name python \
  --expose 5000 \
  -p 5000:5000 \
  --rm -i -t python:2.7.14 bash


  # -P \

# python -m SimpleHTTPServer 5000