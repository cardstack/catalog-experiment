import { default as castFunction } from "./dist/108.js";
import { default as partial } from "./partial.js";
function wrap(value, wrapper) {
  return partial(castFunction(wrapper), value);
}
export { wrap as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTA4LmpzA8LAlcKsLi9wYXJ0aWFsLmpzBsLAgadkZWZhdWx0laFspHdyYXANwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmsY2FzdEZ1bmN0aW9ukgILwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaadwYXJ0aWFskgUKwAGnZGVmYXVsdMDAwJihcgsHwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFAnAkwoLCcDCmaFspHdyYXCSCQ7AwMDAkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXAuanOYoXIJBMAKkQjAwpihchwHwAuRBMDCmKFyAQzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABMDAkQjAwg==
====catalogjs annotation end====*/