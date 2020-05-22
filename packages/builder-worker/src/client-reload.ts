import { ClientEvent } from "./client-event";

export interface ReloadClientEvent extends ClientEvent<ReloadEvent> {
  kind: "reload";
}

export interface ReloadEvent {}

export function isReloadClientEvent(data: any): data is ReloadEvent {
  return "kind" in data && data.kind === "reload" && "clientEvent" in data;
}
