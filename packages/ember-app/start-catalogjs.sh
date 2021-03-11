#!/bin/sh

## TODO use hosted recipes after this is merged to master
node ../file-daemon/bin/file-daemon --builderServer=http://localhost:8080 --uiServer=http://localhost:4300/catalogjs/ui/ --ignore=node_modules $(cat dist/.stage2-output) ../recipes
