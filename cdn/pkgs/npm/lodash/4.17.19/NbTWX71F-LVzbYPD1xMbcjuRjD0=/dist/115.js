import { default as realNames } from "./116.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function getFuncName(func) {
  var result = func.name + '',
      array = realNames[result],
      length = hasOwnProperty0.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;

    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }

  return result;
}
export { getFuncName as default };
/*====catalogjs annotation start====
k5GVwqguLzExNi5qcwPCwIGnZGVmYXVsdJWhbKtnZXRGdW5jTmFtZRLAwNwAFJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqXJlYWxOYW1lc5MCDhDAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAEwEEkMDCAMLAwJehbwEABRGQwJihZwABBgiQwMKZoWQEEwfAkgcFwMKZoWyrb2JqZWN0UHJvdG+SBwvAwMAFkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRGdW5jTmFtZS5qc5ihcgALwMCRBsDCmKFnAQEJDJDAwpmhZAQPCsCUCwoIBsDCmaFsr2hhc093blByb3BlcnR5MJIKD8DAwAiQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldEZ1bmNOYW1lLmpzmKFyAA/AC5EJwMKYoXIDC8DAkQbAwpmhZAHM2Q3AlQ4PEA0JwMKZoWyrZ2V0RnVuY05hbWWSDRPAwMDAkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRGdW5jTmFtZS5qc5ihcgkLwA6RDMDCmKFyNgnAD5EBwMKYoXIZD8AQkQnAwpihcgYJwMCRAcDCmKFnAQMSwJDAwpihZwkLE8CRE8DCmKFyAAvAwJEMwMI=
====catalogjs annotation end====*/