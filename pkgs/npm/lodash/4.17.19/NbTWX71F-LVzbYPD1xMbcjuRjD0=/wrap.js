import { default as castFunction } from "./dist/108.js";
import { default as partial } from "./partial.js";
function wrap(value, wrapper) {
  return partial(castFunction(wrapper), value);
}
export { wrap as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTA4LmpzA8LAlcKsLi9wYXJ0aWFsLmpzBsLAgadkZWZhdWx0lKFspHdyYXANwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxjYXN0RnVuY3Rpb26SAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmncGFydGlhbJIFCsABp2RlZmF1bHTAwJihcgsHwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFAnAkwoLCcDCmKFspHdyYXCSCQ7AwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd3JhcC5qc5ihcgkEwAqRCMDCmKFyHAfAC5EEwMKYoXIBDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAEwMCRCMDC
====catalogjs annotation end====*/