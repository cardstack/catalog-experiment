import { Event as FsEvent } from "../../src/filesystem";
import {
  addEventListener,
  EventListener,
  removeEventListener,
} from "../../src/event-bus";

export async function withListener(
  listener: EventListener<FsEvent>,
  fn: () => Promise<void>
) {
  try {
    addEventListener(listener);
    await fn();
  } finally {
    removeEventListener(listener);
  }
}
