import { FSEvent } from "../../src/filesystem";
import {
  addEventListener,
  EventListener,
  removeEventListener,
} from "../../src/event-bus";

export async function withListener(
  listener: EventListener<FSEvent>,
  fn: () => Promise<void>
) {
  try {
    addEventListener(listener);
    await fn();
  } finally {
    removeEventListener(listener);
  }
}
