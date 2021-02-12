import { default as apply } from "./111.js";
import { default as castPath } from "./17.js";
import { default as last } from "../last.js";
import { default as parent0 } from "./11.js";
import { default as toKey } from "./27.js";
function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent0(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}
export { baseInvoke as default };
/*====catalogjs annotation start====
k5WVwqguLzExMS5qcwPCwJXCpy4vMTcuanMGwsCVwqouLi9sYXN0LmpzCcLAlcKnLi8xMS5qcwzCwJXCpy4vMjcuanMPwsCBp2RlZmF1bHSVoWyqYmFzZUludm9rZRnAwNwAG5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFppWFwcGx5kgIXwACnZGVmYXVsdMDAwJihcgsFwMCRAcDCnKFpABMBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahjYXN0UGF0aJIFE8ABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQESBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmkbGFzdJIIFsACp2RlZmF1bHTAwMCYoXILBMDAkQfAwpyhaQEVBwyQwMICwsDAmaFkCQALwJELwMKZoWmncGFyZW50MJILFMADp2RlZmF1bHTAwMCYoXILB8DAkQrAwpyhaQESCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmldG9LZXmSDhXABKdkZWZhdWx0wMDAmKFyCwXAwJENwMKcoWkBEg0QkMDCBMLAwJehbwEAERiQwJmhZAAXEsCWExQVFhcSwMKZoWyqYmFzZUludm9rZZISGsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJbnZva2UuanOYoXIJCsATkRHAwpihciAIwBSRBMDCmKFyGwfAFZEKwMKYoXI+BcAWkQ3AwpihcgEEwBeRB8DCmKFyLgXAwJEBwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIACsDAkRHAwg==
====catalogjs annotation end====*/