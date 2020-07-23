import { Event } from "./event";

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
export interface Home {
  type: "home";
}

export type UIManagerCommand = Ready | Show | Hide | Home;

export function isUIManagerEvent(event: any): event is Event {
  return (
    typeof event === "object" &&
    typeof event.uiManager === "object" &&
    typeof event.uiManager.type === "string"
  );
}

declare module "./event" {
  interface Event {
    uiManager?: UIManagerCommand;
  }
}
