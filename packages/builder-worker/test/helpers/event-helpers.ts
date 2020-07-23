import {
  addEventListener,
  EventListener,
  removeEventListener,
} from "../../src/event-bus";

export async function withListener(
  listener: EventListener,
  fn: () => Promise<void>
) {
  try {
    addEventListener(listener);
    await fn();
  } finally {
    removeEventListener(listener);
  }
}
