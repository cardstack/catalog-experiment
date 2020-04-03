1. App with two source files, no bundling, no TS.
2. Make it run.
3. Test how you debug it with VSCode (and we know it works in Chrome devtools).
4. Add bundling. See that it still works, loads only one bundle.
   - add babel parser here, probably, for traversal
   - probably adds "wait for service worker" stuff.
   - create filesystem abstraction, and then do less on-demand fetches from SW to files-daemon
     - NEXT: write the fs calling code in file-daemon-client. Write the FileSystem interface. Then implement newer protocol in deno.
   - add in-browser testing infrastructure and use filesystem abstraction to begin testing bundling
5. Test how you debug it with VSCode and Chrome devtools.
6. Convert app to TS. Make types work.
   - adds type creation code
   - this will need traversal that hopefully builds on the same code as step 4
7. Aliasing / locking comes somewhere here in the priorities.
