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
  async sendEvent(clientId: string, event: ClientEvent) {
    let client = await worker.clients.get(clientId);
    if (!client) {
      return;
    }
    client.postMessage({
      kind: "file-daemon-client-event",
      clientEvent: event,
    });
  }
  handleEvent(event: ClientEvent) {
    (async () => {
      for (let clientId of this.clientIds) {
        await this.sendEvent(clientId, event);
      }
    })();
  }
}
