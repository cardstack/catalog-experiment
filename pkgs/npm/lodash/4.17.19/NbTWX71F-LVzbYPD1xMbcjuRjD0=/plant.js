import { default as baseLodash } from "./dist/114.js";
import { default as wrapperClone } from "./dist/101.js";
function wrapperPlant(value) {
  var result,
      parent = this;

  while (parent instanceof baseLodash) {
    var clone = wrapperClone(parent);
    clone.__index__ = 0;
    clone.__values__ = undefined;

    if (result) {
      previous.__wrapped__ = clone;
    } else {
      result = clone;
    }

    var previous = clone;
    parent = parent.__wrapped__;
  }

  previous.__wrapped__ = value;
  return result;
}
export { wrapperPlant as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTE0LmpzA8LAlcKtLi9kaXN0LzEwMS5qcwbCwIGnZGVmYXVsdJShbKx3cmFwcGVyUGxhbnQNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaapiYXNlTG9kYXNokgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFprHdyYXBwZXJDbG9uZZIFC8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAzQEYCcCTCgsJwMKYoWysd3JhcHBlclBsYW50kgkOwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BsYW50LmpzmKFyCQzACpEIwMKYoXJJCsALkQHAwpihchQMwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAzAwJEIwMI=
====catalogjs annotation end====*/