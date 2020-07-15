import { FSEvent } from "../../../builder-worker/src/filesystem";
import {
  Event,
  addEventListener,
  removeEventListener,
} from "../../../builder-worker/src/event-bus";

//@ts-ignore: webpack will set this macro
let fileDaemonKey = FILE_DAEMON_KEY;

export async function waitForFileEvent(
  url: URL,
  timeoutMs: number = 2000
): Promise<void> {
  let timeout = new Promise<void>((_, rej) =>
    setTimeout(
      () => rej(new Error(`timeout while waiting for ${url.href} to change`)),
      timeoutMs
    )
  );
  let change: () => void;
  let updated = new Promise((res) => {
    change = res;
  });

  let listener = (e: Event<FSEvent>) => {
    if (e.group === "fs" && e.args.href === url.href) {
      change();
    }
  };

  addEventListener(listener);
  try {
    await Promise.race([updated, timeout]);
  } finally {
    removeEventListener(listener);
  }
}
