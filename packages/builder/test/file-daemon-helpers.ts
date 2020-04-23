import { FileDaemonClient } from "../src/file-daemon-client";
import {
  FileSystem,
  Event as FSEvent,
  EventType as FSEventType,
  EventListener as FSEventListener,
} from "../src/filesystem";
import { testFileDaemonURL, testWebsocketURL } from "./origins";
//@ts-ignore: webpack will set this macro
let fileDaemonKey = FILE_DAEMON_KEY;

export async function waitFor(
  fs: FileSystem,
  path: string,
  eventType: FSEventType
): Promise<void> {
  let { listener, wait } = makeListener(path, eventType);
  await withListener(fs, listener, async () => await wait());
}

export function makeListener(
  path: string,
  eventType: FSEventType,
  timeoutMs: number = 5000
): { listener: FSEventListener; wait: () => Promise<FSEvent> } {
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
  let wait = async () => {
    let event = await Promise.race([fsUpdated, timeout]);
    if (!event) {
      throw new Error(`timeout waiting for ${eventType} event of '${path}'`);
    }
    return event;
  };

  return { listener, wait };
}

export async function withListener(
  fs: FileSystem,
  l: FSEventListener,
  fn: () => Promise<unknown>
) {
  try {
    fs.addEventListener(testFileDaemonURL, l);
    await fn();
  } finally {
    fs.removeEventListener(testFileDaemonURL, l);
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

export async function removeFile(path: string) {
  let url = new URL(path, testFileDaemonURL);
  await fetch(`${url}?key=${encodeURIComponent(fileDaemonKey)}`, {
    method: "DELETE",
  });
}

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
