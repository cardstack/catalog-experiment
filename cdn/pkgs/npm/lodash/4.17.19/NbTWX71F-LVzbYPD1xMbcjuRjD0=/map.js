import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseMap } from "./dist/74.js";
import { default as isArray } from "./isArray.js";
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}
export { map as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwfCwJXCrC4vZGlzdC83NC5qcwvCwJXCrC4vaXNBcnJheS5qcw/CwIGnZGVmYXVsdJWhbKNtYXAZwMDcABuXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahhcnJheU1hcJICFcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxiYXNlSXRlcmF0ZWWSBhfAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDcDAkMDCmaFkCQAKDJEKwMKZoWmnYmFzZU1hcJIKFsACp2RlZmF1bHTAwMCYoXILB8DAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7Awpmhaadpc0FycmF5kg4UwAOnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA7AwJDAwpehbwEAEhiQwJmhZAARE8CVFBUWFxPAwpmhbKNtYXCSExrAwMDAkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21hcC5qc5ihcgkDwBSREsDCmKFyJgfAFZENwMKYoXIPCMAWkQHAwpihcgMHwBeRCcDCmKFyHAzAwJEFwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIAA8DAkRLAwg==
====catalogjs annotation end====*/