# Catalog-Experiment

This repo proves out ideas for "CatalogJS", our planned JS CDN that eliminates the need for running `npm` or `yarn` and maintaining a `node_modules` folder in your web projects.

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

## Explanation

The builder package is the in-browser (mostly in-service-worker) toolset that gets loaded into your app. It builds itself with webpack.

The example app launches by running the file-daemon to serve itself into the browser, at which point the browser loads the builder tools.
