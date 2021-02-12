var PLACEHOLDER = '__lodash_placeholder__';
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }

  return result;
}
export { replaceHolders as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyucmVwbGFjZUhvbGRlcnMKwMCcl6FvAAABwJDAl6FvAAACCZDAmKFnAAEDBZDAwpmhZAQbBMCSBALAwpmhbKtQTEFDRUhPTERFUpMEBwjAwMACkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19yZXBsYWNlSG9sZGVycy5qc5ihcgALwMCRA8DCmaFkAUEGwJQHCAYDwMKZoWyucmVwbGFjZUhvbGRlcnOSBgvAwMDAkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19yZXBsYWNlSG9sZGVycy5qc5ihcgkOwAeRBcDCmKFyzNULwAiRA8DCmKFyGQvAwJEDwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIADsDAkQXAwg==
====catalogjs annotation end====*/