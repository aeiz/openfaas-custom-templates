#/bin/sh
./generate-manifest.sh
faas-cli up -a ${DOCKER_TOKEN} -f stack.yml