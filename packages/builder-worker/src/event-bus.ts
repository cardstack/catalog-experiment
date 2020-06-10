import bind from "bind-decorator";
import { Event } from "./event"; // this is split out so that it can be consumed in from the packages in the DOM context
export { Event }; // for convenience

export function dispatchEvent<T>(group: string, args: T) {
  EventBus.getInstance().dispatchEvent(group, args);
}

export function addEventListener<T>(fn: EventListener<T>) {
  EventBus.getInstance<T>().addEventListener(fn);
}

export function removeEventListener<T>(fn: EventListener<T>) {
  EventBus.getInstance<T>().removeEventListener(fn);
}

export function removeAllEventListeners() {
  EventBus.getInstance().removeAllEventListeners();
}

export function flushEvents(): Promise<void> {
  return EventBus.getInstance().eventsFlushed();
}

export type EventListener<T> = (event: Event<T>) => void;

export class EventBus<T> {
  private static instance: EventBus<any>;

  static getInstance<S>(): EventBus<S> {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus<S>();
    }
    return EventBus.instance as EventBus<S>;
  }

  private constructor() {}

  private listeners: Set<EventListener<T>> = new Set();
  private drainEvents?: Promise<void>;
  private eventQueue: {
    group: string;
    args: T;
    listener: EventListener<T>;
  }[] = [];

  addEventListener(fn: EventListener<T>) {
    this.listeners.add(fn);
  }

  removeEventListener(fn: EventListener<T>) {
    this.listeners.delete(fn);
  }

  removeAllEventListeners() {
    this.listeners.clear();
  }

  @bind
  dispatchEvent(group: string, args: T): void {
    if (this.listeners.size === 0) {
      return;
    }

    for (let listener of this.listeners) {
      this.eventQueue.push({
        group: group,
        args,
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
      let event = this.eventQueue.shift();
      if (event) {
        let { group, args, listener } = event;
        let dispatched: () => void;
        let waitForDispatch = new Promise((res) => (dispatched = res));
        setTimeout(() => {
          listener({ args, group });
          dispatched();
        }, 0);
        await waitForDispatch;
      }
    }
    eventsDrained!();
  }

  eventsFlushed(): Promise<void> {
    return this.drainEvents ?? Promise.resolve();
  }
}
