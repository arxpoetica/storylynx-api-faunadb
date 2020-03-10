#!/bin/bash

# https://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
NORMAL=$(tput sgr0)


# https://fauna.com/blog/setting-up-a-new-fauna-cluster-using-docker
if [ ! "$(docker ps -a | grep faunadb)" ]; then
	printf "\n${GREEN}Installing FaunaDB Docker container with root key \`secret\`${NORMAL}...\n\n"
	docker pull fauna/faunadb:latest
	docker run --name faunadb -p 8443:8443 -d fauna/faunadb
	# docker cp ./migrations mysql:/migrations
fi

if [ ! -d ./dashboard ]; then
	printf "\n${GREEN}Installing FaunaDB dashboard${NORMAL}...\n\n"
	git clone https://github.com/fauna/dashboard
	cd dashboard
	yarn install
fi
