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

1. Start the test server
   ```sh
   yarn test-server
   ```
2. Start the builder (which also serves the tests)
   ```sh
   yarn builder
   ```
3. Open the URL `http://localhost:8080` in your browser

Note that the tests leverage a test server that runs a ports meant just for testing. If you run tests from the CLI, QUnit tests that happen to be open in the browser may try to connect to the test server (based on the tests that are running in your browser) that the CLI is using and will troll you.

## Explanation

The builder package is the in-browser (mostly in-service-worker) toolset that gets loaded into your app. It builds itself with webpack.

The example app launches by running the file-daemon to serve itself into the browser, at which point the browser loads the builder tools.
