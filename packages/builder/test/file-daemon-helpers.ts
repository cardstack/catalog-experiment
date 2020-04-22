import { FileDaemonClient } from "../src/file-daemon-client";
import { FileAssert } from "./file-assertions";
import {
  FileSystem,
  Event as FSEvent,
  EventType as FSEventType,
  EventListener as FSEventListener,
} from "../src/filesystem";
import { testFileDaemonURL, testWebsocketURL } from "./origins";
//@ts-ignore: webpack will set this macro
let fileDaemonKey = FILE_DAEMON_KEY;

export function waitForListener(
  path: string,
  eventType: FSEventType,
  timeoutMs: number = 2000
): { listener: FSEventListener; promise: () => Promise<FSEvent> } {
  let timeout = new Promise<void>((res) => setTimeout(() => res(), timeoutMs));
  let change: (e: FSEvent) => void;
  let fsUpdated = new Promise<FSEvent>((res) => (change = res));
  let listener = (e: FSEvent) => {
    if (
      e.type === eventType &&
      e.url.toString() === new URL(path, testFileDaemonURL).toString()
    ) {
      change(e);
    }
  };
  let promise = async () => {
    let event = await Promise.race([fsUpdated, timeout]);
    if (!event) {
      throw new Error(`timeout waiting for ${eventType} event of '${path}'`);
    }
    return event;
  };

  return { listener, promise };
}

export async function withEventListener(
  assert: FileAssert,
  l: FSEventListener,
  fn: () => Promise<void>
) {
  try {
    assert.fs.addEventListener(l);
    await fn();
  } finally {
    assert.fs.removeEventListener(l);
  }
}

export function makeClient(fs: FileSystem, mountpoint = "/") {
  return new FileDaemonClient(
    testFileDaemonURL,
    testWebsocketURL,
    fs,
    mountpoint
  );
}

export async function setFile(path: string, contents: string) {
  let url = new URL(path, testFileDaemonURL);
  await fetch(`${url}?key=${encodeURIComponent(fileDaemonKey)}`, {
    method: "POST",
    body: contents,
  });
}

// it's important that this is called *before* the assert.setupFiles() is
// called, as this will initialize the underlying filesystem that is synced to
// our fs abstration.
export async function setupScenario(scenario: { [filePath: string]: string }) {
  await fetch(
    `${testFileDaemonURL}?scenario=true&key=${encodeURIComponent(
      fileDaemonKey
    )}`,
    {
      method: "POST",
      body: JSON.stringify(scenario),
    }
  );
}

export async function resetFileSystem() {
  await fetch(
    `${testFileDaemonURL}?reset=true&key=${encodeURIComponent(fileDaemonKey)}`,
    { method: "POST" }
  );
}
