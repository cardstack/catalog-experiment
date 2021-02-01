import { default as baseUpdate } from "./dist/13.js";
import { default as castFunction } from "./dist/108.js";
function updateWith(object, path, updater, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}
export { updateWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTMuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0lKFsqnVwZGF0ZVdpdGgNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaapiYXNlVXBkYXRlkgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGNhc3RGdW5jdGlvbpIFC8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAGQnAkwoLCcDCmKFsqnVwZGF0ZVdpdGiSCQ7AwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdXBkYXRlV2l0aC5qc5ihcgkKwAqRCMDCmKFyzJIKwAuRAcDCmKFyDwzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACsDAkQjAwg==
====catalogjs annotation end====*/