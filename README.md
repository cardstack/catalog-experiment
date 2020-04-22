# Catalog-Experiment

This repo proves out ideas for "CatalogJS", our planned JS CDN that eliminates the need for running `npm`/`yarn` and eliminating maintaining a `node_modules` folder in your web projects.

## Building it

Setup all the npm dependencies:

```sh
yarn install
```

## Running it

1. Start typescript compilation:

   ```sh
   yarn build --watch
   ```

   Alternatively if you don't want to watch typescript files for changes and only
   want to perform just a single build, then omit the `--watch` parameter.

2. Start serving the builder:
   ```sh
   yarn builder
   ```
3. Start serving the app:
   ```sh
   yarn serve
   ```

Conversely, if you want to use webpack to package up the file-daemon's js into a single bundle and run the file daemon from the webpack generated package, then:

1. Run the webpack for the file-daemon:
   ```sh
   cd ./packages/file-daemon && yarn start
   ```
2. Start serving the builder:
   ```sh
   yarn builder
   ```
3. Start serving the from the webpack package:
   ```sh
   cd ./package/app && yarn start-pkg
   ```

## Testing it

From the command line you can run all the tests by executing the following from the project root:

```sh
yarn test
```

To run the tests from the browser:

1. Change directories to the builder package: `cd packages/builder`
2. Start the test file daemon:
   ```sh
   yarn start:test-file-daemon
   ```
3. Start the builder:
   ```sh
   yarn start
   ```
4. Open the URL `http://localhost:8080` in your browser

Note that the tests leverage a service worker which still runs even when the test page is not open. If you run tests from the CLI, the service worker running in your browser may troll you. In which case you'll want to unregister the service worker in your browser so they don't interfere with one another.

## Explanation

The builder package is the in-browser (mostly in-service-worker) toolset that gets loaded into your app. It builds itself with webpack.

The example app launches by running the file-daemon to serve itself into the browser, at which point the browser loads the builder tools.
