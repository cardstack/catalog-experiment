import { default as baseSum } from "./168.js";
var NAN = 0 / 0;
function baseMean(array, iteratee) {
  var length = array == null ? 0 : array.length;
  return length ? baseSum(array, iteratee) / length : NAN;
}
export { baseMean as default };
/*====catalogjs annotation start====
k5GVwqguLzE2OC5qcwPCwIGnZGVmYXVsdJWhbKhiYXNlTWVhbg7AwNwAEJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2Jhc2VTdW2SAgvAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICsDAkMDCl6FvAQAGDZDAmKFnAAEHCZDAwpmhZAQICMCSCAbAwpmhbKNOQU6SCAzAwMAGkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlTWVhbi5qc5ihcgADwMCRB8DCmaFkAQMKwJQLDAoHwMKZoWyoYmFzZU1lYW6SCg/AwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlTWVhbi5qc5ihcgkIwAuRCcDCmKFyVwfADJEBwMKYoXIdA8DAkQfAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAIwMCRCcDC
====catalogjs annotation end====*/