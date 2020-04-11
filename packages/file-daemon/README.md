# File-Daemon

This library provides a node file-daemon that is responsible for reflecting a
directory tree to a file-daemon client and notifying the client about any
changes made within the directory. This library leverages both an HTTP file
server for full directory syncs as well as a websocket server to notify
connected clients about any changes to the directory being monitored. The file
server leverages a "tarstream" (see sibling package `tarstream`) to stream a tar
file containing the full directory structure to clients.
