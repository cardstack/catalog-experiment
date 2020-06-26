import { Event } from "./event";
export const eventGroup = "reload";

export interface ReloadEvent {}

export function isReloadEvent(event: any): event is Event<ReloadEvent> {
  return (
    typeof event === "object" &&
    "group" in event &&
    event.group === eventGroup &&
    "args" in event
  );
}
