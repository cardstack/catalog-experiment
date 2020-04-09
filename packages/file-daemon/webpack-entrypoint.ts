// Webpack does not play nicely with ESM, hence this dedicated entry point.

import { start } from "./daemon";

start();
