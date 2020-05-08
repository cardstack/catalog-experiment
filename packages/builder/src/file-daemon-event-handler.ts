import { Event as ClientEvent } from "./file-daemon-client";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
export class FileDaemonEventHandler {
  private clientIds: Set<string> = new Set();

  addClient(clientId: string) {
    this.clientIds.add(clientId);
  }
  removeClient(clientId: string) {
    this.clientIds.delete(clientId);
  }
  handleEvent(event: ClientEvent) {
    (async () => {
      for (let clientId of this.clientIds) {
        let client = await worker.clients.get(clientId);
        // Exit early if we don't get the client.
        // Eg, if it closed.
        if (!client) {
          this.removeClient(clientId);
          continue;
        }
        client.postMessage({
          kind: "file-daemon-client-event",
          clientEvent: event,
        });
      }
    })();
  }
}
