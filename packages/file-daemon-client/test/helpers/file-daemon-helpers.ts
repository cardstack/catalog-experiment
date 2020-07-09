import {
  Event as FSEvent,
  eventGroup,
} from "../../../builder-worker/src/filesystem";
import { EventListener, Event } from "../../../builder-worker/src/event-bus";

import { testFileDaemonURL } from "../../../builder-worker/test/origins";
//@ts-ignore: webpack will set this macro
let fileDaemonKey = FILE_DAEMON_KEY;

export function makeListener(
  origin: string,
  category: string,
  eventType?: string,
  path?: string,
  timeoutMs: number = 2000
): { listener: EventListener<FSEvent>; wait: () => Promise<Event<FSEvent>> } {
  let timeout = new Promise<void>((res) => setTimeout(() => res(), timeoutMs));
  let change: (e: Event<FSEvent>) => void;
  let fsUpdated = new Promise<Event<FSEvent>>((res) => (change = res));
  let listener = (e: Event<FSEvent>) => {
    if (e.group === eventGroup) {
      if (
        path &&
        e.args.type === eventType &&
        e.args.category === category &&
        e.args.href === new URL(path, origin).href
      ) {
        change(e);
      } else if (
        !path &&
        e.args.type === eventType &&
        e.args.category === category
      ) {
        change(e);
      } else if (!path && !eventType && e.args.category === category) {
        change(e);
      }
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
