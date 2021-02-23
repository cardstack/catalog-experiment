import { default as baseNth } from "./dist/127.js";
import { default as toInteger } from "./toInteger.js";
function nth(array, n) {
  return array && array.length ? baseNth(array, toInteger(n)) : undefined;
}
export { nth as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTI3LmpzA8LAlcKuLi90b0ludGVnZXIuanMHwsCBp2RlZmF1bHSVoWyjbnRoD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmnYmFzZU50aJICDMAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaal0b0ludGVnZXKSBg3AAadkZWZhdWx0wMDAmKFyCwnAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIEMDAkMDCl6FvAQAKDpDAmaFkABMLwJMMDQvAwpmhbKNudGiSCxDAwMDAkNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL250aC5qc5ihcgkDwAyRCsDCmKFyLgfADZEBwMKYoXIICcDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgADwMCRCsDC
====catalogjs annotation end====*/