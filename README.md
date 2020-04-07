# Running it

1. If you want typescript to work right in the Deno code, you need to clone https://github.com/denoland/deno as a sibling of this repo, and adjust the import line endings so TS will accept them:

   ![vscode-screenshot](https://user-images.githubusercontent.com/61075/78299561-250ab880-7504-11ea-91a7-8167ff2a25fd.png)
2. Clone the https://github.com/oakserver/media_types as a sibling of this repo, and adjust the import line endings in the same manner (but just in the `mod.ts` file).
3. Start the local fileserver that backs deno relative imports (_sigh_) via `cd packages/file-daemon && yarn start`.
4. Start compiling the build's own code with `cd packages/builder && yarn start`
5. Start serving the app with `cd app && yarn start`

# Explanation

TypeScript does not like relative imports with extensions. Deno _insists_ on relative imports with extensions. To keep both happy, we use localhost URLs instead, and serve our own files to ourself with the `http-server` npm package. That is why there is a `yarn start` in the file-daemon.

The builder package is the in-browser (mostly in-service-worker) toolset that gets loaded into your app. It builds itself with webpack.

The example app launches by running the file-daemon to serve itself into the browser, at which point the browser loads the builder tools.
