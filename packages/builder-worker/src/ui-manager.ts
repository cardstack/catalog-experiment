import { Event } from "./event";

export const eventGroup = "ui-manager";

export interface Ready {
  type: "ready";
  width: number;
}

export interface Show {
  type: "show";
}

export interface Hide {
  type: "hide";
}

export type UIManagerCommand = Ready | Show | Hide;

export function isUIManagerEvent(event: any): event is Event<UIManagerCommand> {
  return "group" in event && event.group === eventGroup && "args" in event;
}
