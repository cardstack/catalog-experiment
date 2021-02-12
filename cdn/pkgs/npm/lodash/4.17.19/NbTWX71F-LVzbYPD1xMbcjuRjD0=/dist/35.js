import { default as identity } from "../identity.js";
import { default as metaMap } from "./39.js";
var baseSetData = !metaMap ? identity : function (func, data) {
  metaMap.set(func, data);
  return func;
};
export { baseSetData as default };
/*====catalogjs annotation start====
k5KVwq4uLi9pZGVudGl0eS5qcwPCwJXCpy4vMzkuanMGwsCBp2RlZmF1bHSVoWyrYmFzZVNldERhdGEPwMDcABGXoW8AAAPAkMCZoWQJAALAkQLAwpmhaahpZGVudGl0eZICDMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAZAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmnbWV0YU1hcJMFCw3AAadkZWZhdWx0wMDAmKFyCwfAwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEIgrAlQsMDQoIwMKZoWyrYmFzZVNldERhdGGSChDAwMAIkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU2V0RGF0YS5qc5ihcgALwAuRCcDCmKFyBAfADJEEwMKYoXIDCMANkQHAwpihch0HwMCRBMDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAvAwJEJwMI=
====catalogjs annotation end====*/