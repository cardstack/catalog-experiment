import { default as baseSum } from "./dist/168.js";
import { default as identity } from "./identity.js";
function sum(array) {
  return array && array.length ? baseSum(array, identity) : 0;
}
export { sum as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTY4LmpzA8LAlcKtLi9pZGVudGl0eS5qcwbCwIGnZGVmYXVsdJShbKNzdW0NwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaadiYXNlU3VtkgIKwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqGlkZW50aXR5kgULwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAICcCTCgsJwMKYoWyjc3VtkgkOwMDAwNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3N1bS5qc5ihcgkDwAqRCMDCmKFyKwfAC5EBwMKYoXIICMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgADwMCRCMDC
====catalogjs annotation end====*/