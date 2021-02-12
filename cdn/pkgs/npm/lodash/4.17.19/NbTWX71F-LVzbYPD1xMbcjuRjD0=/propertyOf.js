import { default as baseGet } from "./dist/14.js";
function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}
export { propertyOf as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSVoWyqcHJvcGVydHlPZgnAwJuXoW8AAAPAkMCZoWQJAALAkQLAwpmhaadiYXNlR2V0kgIHwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUIkMCZoWQAFgbAkgcGwMKZoWyqcHJvcGVydHlPZpIGCsDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHJvcGVydHlPZi5qc5ihcgkKwAeRBcDCmKFyTgfAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACsDAkQXAwg==
====catalogjs annotation end====*/