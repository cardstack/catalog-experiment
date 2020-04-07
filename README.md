# Running it

1. Start a webpack watch to compile conventional typescript for deno to consume: `cd packages/file-daemon && yarn start`.
2. Start compiling the build's own code with `cd packages/builder && yarn start`
3. Start serving the app with `cd app && yarn start`

# Explanation

TypeScript does not like relative imports with extensions. Deno _insists_ on relative imports with extensions. To keep both happy, we have forked the deno codebase and have stripped out all the `.ts` extensions from the Deno std libs. Additionally we use webpack to compile the resulting typescipt so that all imports are inlined, and we launch deno using the compiled result.

The builder package is the in-browser (mostly in-service-worker) toolset that gets loaded into your app. It builds itself with webpack.

The example app launches by running the file-daemon to serve itself into the browser, at which point the browser loads the builder tools.
