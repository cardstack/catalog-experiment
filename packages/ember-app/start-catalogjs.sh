#!/bin/sh

node ../file-daemon/bin/file-daemon --port 4201 --builderServer=http://localhost:8080 --uiServer=http://localhost:4300/catalogjs/ui/ --ignore node_modules `cat dist/.stage2-output`
