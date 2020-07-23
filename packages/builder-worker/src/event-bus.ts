import bind from "bind-decorator";
import { Event } from "./event"; // this is split out so that it can be consumed in from the packages in the DOM context
export { Event }; // for convenience

export function dispatchEvent(event: Event) {
  EventBus.getInstance().dispatchEvent(event);
}

export function addEventListener(fn: EventListener) {
  EventBus.getInstance().addEventListener(fn);
}

export function removeEventListener(fn: EventListener) {
  EventBus.getInstance().removeEventListener(fn);
}

export function removeAllEventListeners() {
  EventBus.getInstance().removeAllEventListeners();
}

export function flushEvents(): Promise<void> {
  return EventBus.getInstance().eventsFlushed();
}

export type EventListener = (event: Event) => void;

export class EventBus {
  private static instance: EventBus;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance as EventBus;
  }

  private constructor() {}

  private listeners: Set<EventListener> = new Set();
  private drainEvents?: Promise<void>;
  private eventQueue: {
    event: Event;
    listener: EventListener;
  }[] = [];

  addEventListener(fn: EventListener) {
    this.listeners.add(fn);
  }

  removeEventListener(fn: EventListener) {
    this.listeners.delete(fn);
  }

  removeAllEventListeners() {
    this.listeners.clear();
  }

  @bind
  dispatchEvent(event: Event): void {
    if (this.listeners.size === 0) {
      return;
    }

    for (let listener of this.listeners) {
      this.eventQueue.push({
        event,
        listener,
      });
    }
    (async () => await this.drainEventQueue())();
  }

  private async drainEventQueue(): Promise<void> {
    await this.drainEvents;

    let eventsDrained: () => void;
    this.drainEvents = new Promise((res) => (eventsDrained = res));

    while (this.eventQueue.length > 0) {
      let item = this.eventQueue.shift()!;
      let { event, listener } = item;
      let dispatched: () => void;
      let waitForDispatch = new Promise((res) => (dispatched = res));
      setTimeout(() => {
        listener(event);
        dispatched();
      }, 0);
      await waitForDispatch;
    }
    eventsDrained!();
  }

  eventsFlushed(): Promise<void> {
    return this.drainEvents ?? Promise.resolve();
  }
}
