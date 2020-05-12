import {
  FileSystem,
  EventListener as FSEventListener,
} from "../../src/filesystem";

export async function withListener(
  fs: FileSystem,
  origin: string,
  listener: FSEventListener,
  fn: () => Promise<unknown>
) {
  try {
    fs.addEventListener(origin, listener);
    await fn();
  } finally {
    fs.removeEventListener(origin, listener);
  }
}
