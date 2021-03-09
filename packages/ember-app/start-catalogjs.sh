#!/bin/sh

node ../file-daemon/bin/file-daemon --builderServer=http://localhost:8080 --uiServer=http://localhost:4300/catalogjs/ui/ --pkgsPath=../../working/cdn/pkgs --ignore=node_modules $(cat dist/.stage2-output)
