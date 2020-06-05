import {
  Event as FSEvent,
  EventListener as FSEventListener,
} from "../../src/filesystem";

import { testFileDaemonURL } from "../origins";
//@ts-ignore: webpack will set this macro
let fileDaemonKey = FILE_DAEMON_KEY;

export function makeListener(
  origin: string,
  category: string,
  eventType?: string,
  path?: string,
  timeoutMs: number = 2000
): { listener: FSEventListener; wait: () => Promise<FSEvent> } {
  let timeout = new Promise<void>((res) => setTimeout(() => res(), timeoutMs));
  let change: (e: FSEvent) => void;
  let fsUpdated = new Promise<FSEvent>((res) => (change = res));
  let listener = (e: FSEvent) => {
    if (
      path &&
      e.type === eventType &&
      e.category === category &&
      e.href === new URL(path, origin).href
    ) {
      change(e);
    } else if (!path && e.type === eventType && e.category === category) {
      change(e);
    } else if (!path && !eventType && e.category === category) {
      change(e);
    }
  };
  let wait = async () => {
    let event = await Promise.race([fsUpdated, timeout]);
    if (!event) {
      throw new Error(
        `timeout waiting for ${category}:${eventType} event of '${path}'`
      );
    }
    return event;
  };

  return { listener, wait };
}

export async function setFile(path: string, contents: string) {
  let url = new URL(path, testFileDaemonURL);
  await fetch(`${url}?key=${encodeURIComponent(fileDaemonKey)}`, {
    method: "POST",
    body: contents,
  });
}

export async function getFile(path: string): Promise<Response> {
  let url = new URL(path, testFileDaemonURL);
  return await fetch(url.href);
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
    {
      method: "POST",
    }
  );
}
