#!/bin/bash
set -e

reset="\033[0m"
red="\033[31m"
green="\033[32m"
yellow="\033[33m"
cyan="\033[36m"
white="\033[37m"

BASEDIR=$(dirname "$0")/..

check_node_version() {
  requiredVersion="14.5.0"
  rawNodeVersion=$(node --version)
  nodeVersion=${rawNodeVersion//v/}
  desiredSort=$(echo -e "${requiredVersion}\n${nodeVersion}")
  actualSort=$(echo -e "$desiredSort" | sort -t '.' -k 1,1 -k 2,2 -k 3,3 -k 4,4 -g)
  if [ "$desiredSort" != "$actualSort" ]; then
    printf "${red}CatalogJS requires node version ${requiredVersion} or greater. Your node version is ${nodeVersion}.$reset\n"
  fi
}

exit() {
  printf "${green}\nStopping CatalogJS$reset\n"
}

trap exit SIGINT
check_node_version
printf "${green}Starting CatalogJS$reset\n"
node ${BASEDIR}/file-daemon/main.js $@
