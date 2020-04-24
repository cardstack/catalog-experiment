import {
  FileSystem,
  Event as FSEvent,
  EventType as FSEventType,
  EventListener as FSEventListener,
} from "../../src/filesystem";

export function makeListener(
  origin: string,
  eventType?: FSEventType,
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
      e.url.toString() === new URL(path, origin).toString()
    ) {
      change(e);
    } else if (!path && e.type === eventType) {
      change(e);
    } else if (!path && !eventType) {
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

export async function withListeners(
  fs: FileSystem,
  origin: string,
  listeners: FSEventListener[],
  fn: () => Promise<unknown>
) {
  try {
    for (let l of listeners) {
      fs.addEventListener(origin, l);
    }
    await fn();
  } finally {
    for (let l of listeners) {
      fs.removeEventListener(origin, l);
    }
  }
}
