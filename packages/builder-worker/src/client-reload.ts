import { Event } from "./event";

export function isReloadEvent(event: any): event is Event {
  return (
    typeof event === "object" && "reload" in event && event.reload === true
  );
}

declare module "./event" {
  interface Event {
    reload?: true;
  }
}
