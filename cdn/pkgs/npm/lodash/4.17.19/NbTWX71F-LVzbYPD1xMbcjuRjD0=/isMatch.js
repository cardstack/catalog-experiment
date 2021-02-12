import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";
function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}
export { isMatch as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDIuanMDwsCVwqwuL2Rpc3QvNzIuanMGwsCBp2RlZmF1bHSVoWynaXNNYXRjaA3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaatiYXNlSXNNYXRjaJICCsAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsZ2V0TWF0Y2hEYXRhkgULwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgMkMCZoWQADAnAkwoLCcDCmaFsp2lzTWF0Y2iSCQ7AwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzTWF0Y2guanOYoXIJB8AKkQjAwpihcjELwAuRAcDCmKFyEQzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAB8DAkQjAwg==
====catalogjs annotation end====*/