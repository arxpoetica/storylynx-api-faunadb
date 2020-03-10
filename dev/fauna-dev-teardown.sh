#!/bin/bash
# SEE: https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes

# https://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
# YELLOW=$(tput setaf 3)
RED=$(tput setaf 1)
NORMAL=$(tput sgr0)

# SEE: https://medium.com/@migueldoctor/run-mysql-phpmyadmin-locally-in-3-steps-using-docker-74eb735fa1fc
if [ "$(docker ps -a | grep faunadb)" ]; then
	printf "${RED}Killing faunadb Docker container...${NORMAL}\n\n"
	docker stop faunadb
fi

if [ -d ./dashboard ]; then
	printf "${RED}Deleting FaunaDB dashboard...${NORMAL}\n\n"
	rm -rf dashboard
fi

printf "\n${RED}Pruning all unused or dangling images, containers, volumes, and networks${NORMAL}..."
docker system prune -a
