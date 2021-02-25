# Catalog-Experiment

This repo proves out ideas for "CatalogJS", our planned JS CDN that eliminates
the need for running `npm`/`yarn` and eliminating maintaining a `node_modules`
folder in your web projects.

## Installing it
To install CatalogJS run the following command:
```
curl -o- -L https://install.catalogjs.com/install.sh | bash
```
This will install catalogjs to your `~/.catalogjs` folder, as well as add the catalogJS bin to your `$PATH` env var.

## Running it
After installing CatalogJS you can run it by changing directories to your project, and executing `catalogjs` followed by the directories that you want available to the catalogjs build environment. This would be your project directory and any other local dependencies your project has (e.g. another library your project consumes that you also want built by CatalogJS). For example:
```
catalogjs . ../test-lib ../../cdn/pkgs
```
where `../test-lib` and `../../cdn/pkgs` are directories that you want to make available to the CatalogJS build environment.

After the CatalogJS file server starts, you can open your browser with the URL displayed on the command line (http://localhost:4200 is the default).

Note: if you want to work with local recipes, you can just mount that directory as well. We'll default to the github hosted recipes unless a local recipes filesystem is mounted, in which case we'll use the local one. Recipes can be locally referenced from the `packages/recipes` directory in this project.

## Building it

Setup all the npm dependencies:

```sh
yarn install
```

## Running it (for purposes of development)

1. Perform typescript compilation:

   ```sh
   yarn build
   ```
2. Start serving the builder:
   ```sh
   yarn builder
   ```
3. Start serving the CatalogJS UI:
   ```
   yarn ui
   ```
4. Start serving the sample app:
   ```sh
   yarn serve
   ```
   Note: if you want to be able to work with recipes locally (instead of being served from github, which is the default), then you can additionally mount the `../recipes` folder in the package.json for the `packages/test-app` (or `packages/test-lib`). When a local recipes filesystem is mounted we will use that instead of the github hosted recipes.

If you want to use a `tsc --watch`, it's a little tricky since each package has
its own `tsconfig.json` and needs to have it's own `tsc --watch`. You can run
`tsc --watch` in all the projects separately. Or, if you are using VS Code, we
have setup a auto watch tasks that will automatically `tsc --watch` all the
projects when you open the VS Code workspace for this project. You'll need to
first confirm that you want to run the auto tasks, which you can enable in the
`Tasks: Manage Automatic Tasks in Folder` from the Command Palette.

Conversely, if you want to run the standalone version of CatalogJS (the same version that users download and install), you can run:
```
yarn pkg
```
And the package will be created in the `./dist` folder. From there the `./dist/catalogjs` script can be executed.

## Testing it

From the command line you can run all the tests by executing the following from
the project root:

```sh
yarn test
```

To run the tests from the browser:

1. Start the builder (which also serves the tests)
   ```sh
   yarn builder
   ```
2. Open the URL `http://localhost:8080` in your browser

Note that the tests leverage a test server that runs a ports meant just for
testing. If you run tests from the CLI, QUnit tests that happen to be open in
the browser may try to connect to the test server (based on the tests that are
running in your browser) that the CLI is using and will troll you.

To run the node tests:

1. cd to `packages/builder-worker`
2. run webpack:
   ```sh
   yarn webpack
   ```
   (use the `--watch` option if you want to watch the file system for changes)
3. run the tests:
   ```sh
   yarn qunit assets/node-test.js
   ```

## Releasing it

To package CatalogJS for standalone consumption. Run the following command providing AWS env var credentials for the catalogjs hosting environment:
```
AWS_PROFILE=your_aws_creds yarn release
```

## Explanation

The builder package is the in-browser (mostly in-service-worker) toolset that
gets loaded into your app. It builds itself with webpack.

The example app launches by running the file-daemon to serve itself into the
browser, at which point the browser loads the builder tools.

# In-progress design notes

Sketch of basic app dependency design:

1. App has list of direct dependencies. Something that leaves room for multiple package namespaces and differing source options:

   ```json
   "assert-never": { "npm": { "package": "assert-never", "range": "^1.2.0" }},
   "babel-loader": { "git": { "repository": "https://github.com/babel/babel", "subdir": "packages/loader", "tag": "v8.0.0" }},
   ```

   We probably still have deps, devDeps, and peerDeps as separate sections.

2. The point of transitive dependency locking is _determinism_. We achieve determinism by recording a global clock per each directly dependency. This lets us know the deterministic _inputs_ to the optimizer which lets us do well-controlled upgrades to subgraphs of the dependencies without destabilizing the whole graph.

3. Each direct dependency gets downloaded as a bundle representing the package and all its deps. We can choose later to split out common chunks of shared deps when that is statistically justified, but we accept that lots of overfetching will happen here and it's ok (it will still probably be less overfetching than npm). Possible design: name the bundle `${package}-${version}-${clock}.js`.

   Management of the clock is up to us to optimize, it's opaque to all public API. A very coarse clock will require us to host fewer bundles, but introduces latency before new packages show up. We might want to handle the low-latency case explicitly in our equivalent of yarn resolutions.

   To import packages from NPM:

   - we're going to delegate installs (and all the custom postinstall stuff) to yarn
   - to keep determinism, we're going to save the yarn.lock that results, per package per version.
   - the bundle we build is tied to our global clock when we built it, which is derived from the yarn.lock version we used.
   - as we traverse all the deps, we save bundles for each package, which cuts down on the number of independent yarn installs we need to run and build. They will all share a clock.
   - there are optimizations possible where you can reuse earlier bundles, as long as they truly match what yarn just decided
     - packages with no deps that are on the same version as we've seen before, we can just reuse that bundle (at its earlier clock)
     - moving up from there, if all your deps are reused bundles you can be a reused bundle too

4. Beyond optimization, it's important for correctness that we resolve duplicates deterministically even in dev, so it matches the optimized prod output. We will handle this via our combineModules, which will need to annotate _dependsOn_ with the reason why, including semver ranges.

5. All third-party bundles will go through combineModules even in dev, this ensures correctness and things like yarn-resolutions get applied. We will probably configure the bundle assignments so that all public exports are available to the app (this means we don't need to rebuild third-party bundles at all as the app changes). Not until prod do we shake out the unused parts.

   The app's own code can be served almost entirely unbundled in dev.

6. When running a build, whenever we encounter a dependency and it's not in the lock file, we choose and update the lock file. Rebuilds are stable only because of lock file.

## Package Recipes

To encapsulate the complexity of all the ways packages get distributed and build, we will want to offer good tooling for declarative recipes for importing packages. Examples of things we'll need:

- use source code from "repository" field in package.json instead of distributed code (because they already compiled away modules, for example
- second-guess the author's decision on what are deps vs peer deps. Adding missing peerDeps.
- transpiling out typescript types is needed when importing, probably not even a recipe option, just always available.

# TODO

2. Add the test library to the test app. Run it in the mode where both projects are being passed into Builder.forProjects(), this gives live editing of both pieces together.

   - this implies that when you add the library to the app, the app gets a lockfile.

3. Also be able to run the app by itself, in which case the library bundle is not layered locally in the FS and comes directly from CDN.

4. Pick one of builder's own deps as a good candidate library to add to sample app. Implement a CLI tool that can generate our bundle for that package. Probably needs beginning of recipe system.

   Could put the bundle in a subdir of the monorepo or directly in s3.

5. Write a package.json-like file in test app and add the bundle.

6. Make the builder actually consume that dependency so it's available to the app code.
