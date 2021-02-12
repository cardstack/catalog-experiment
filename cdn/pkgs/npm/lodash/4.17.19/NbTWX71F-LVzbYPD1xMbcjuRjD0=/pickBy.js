import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as basePickBy } from "./dist/12.js";
import { default as getAllKeysIn } from "./dist/80.js";
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }

  var props = arrayMap(getAllKeysIn(object), function (prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function (value, path) {
    return predicate(value, path[0]);
  });
}
export { pickBy as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC8xMi5qcwnCwJXCrC4vZGlzdC84MC5qcwzCwIGnZGVmYXVsdJWhbKZwaWNrQnkVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaahhcnJheU1hcJICEMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsYmFzZUl0ZXJhdGVlkgUSwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpmhaapiYXNlUGlja0J5kggTwAKnZGVmYXVsdMDAwJihcgsKwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaaxnZXRBbGxLZXlzSW6SCxHAA6dkZWZhdWx0wMDAmKFyCwzAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhSQwJmhZABWD8CVEBESEw/AwpmhbKZwaWNrQnmSDxbAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BpY2tCeS5qc5ihcgkGwBCRDsDCmKFyUAjAEZEBwMKYoXIBDMASkQrAwpihckMMwBORBMDCmKFyFgrAwJEHwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIABsDAkQ7Awg==
====catalogjs annotation end====*/