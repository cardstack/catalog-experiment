# file-daemon
A Deno websocket server and client that can watch a filesystem and statically
host files from the watched filesystem. The server watches the specified
directory and notifies the connected clients about any changes to the files in
the watched directory tree. The clients can also request the file contents of
the directory being watched via the static web server.

## Prerequisites
- The [Deno](https://deno.land) runtime:
   ```sh
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

## Running
1. First start the server:
   ```sh
   ./file-daemon.ts -d directory/to/watch
   ```
   (use the `--help` to view all the command line options)

2. Next start the client(s):
   ```sh
   ./example-client.ts http://localhost:3000
   ```
   The server URL is optional. If you don't provide the server URL, then the
   client will default to http://localhost:3000 (which is the default server
   port)

   The server won't actually start watching the filesystem until there is at
   least one client connected. And the server will stop watching the filesystem
   if all the clients disconnect. When a client first connects the server will
   inform the client about all the files that are in the watched directory. From
   that point forward the client will receive notifications only for modifed and
   removed files.

   The server will also host files from the specifed directory using the
   specified file hosting port (defaults to 4200). You can use the relative
   paths that are emitted from the file watcher and append that to
   http://localhost:4200 to get the file contents using an HTTP GET.