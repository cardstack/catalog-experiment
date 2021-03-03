#!/bin/sh

node ../file-daemon/bin/file-daemon --builderServer=http://localhost:8080 --uiServer=http://localhost:4300/catalogjs/ui/ --ignore node_modules --port 4201 `cat dist/.stage2-output`
