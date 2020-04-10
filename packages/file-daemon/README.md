# File-Daemon

This library provides a node file-daemon that is responsible for reflecting a
directory tree to a file-daemon client and notifying the client about any
changes made within the directory. This library leverages both an HTTP file
server for full directory syncs as well as a websocket server to notify
connected clients about any changes to the directory being monitored. The file
server leverages a "tarstream" (see sibling package `tarstream`) to stream a tar
file containing the full directory structure to clients.

### Notes

Right now we are using PR branch of the `web-streams-polyfill` while we wait for
the PR https://github.com/MattiasBuelens/web-streams-polyfill/pull/49 to be
approved. `web-streams-polyfill` provides an npm package whose `dist/` assets
are not held in github, meaning that we need to run a build for this module as
part of our own build while we wait for our updates to get upstreamed. To
support this, all the `devDependencies` of this module are actually inherited
from `web-streams-polyfill` to support this build. As soon as our PR is
upstreamed, we should remove the `devDependencies` in this project as well as
the additional build that we perform for `web-streams-polyfill`.`
