import { ClientEvent } from "./client-event";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export class ClientEventHandler<T> {
  private clientIds: Set<string> = new Set();

  // we use the "kind" property on the client to disambiguate between the
  // different post message types
  constructor(private kind: string) {}

  addClient(clientId: string) {
    this.clientIds.add(clientId);
  }
  removeClient(clientId: string) {
    this.clientIds.delete(clientId);
  }

  async sendEvent(clientId: string, event: T) {
    let client = await worker.clients.get(clientId);
    if (!client) {
      return;
    }
    let clientEvent: ClientEvent<T> = { kind: this.kind, clientEvent: event };
    client.postMessage(clientEvent);
  }
  handleEvent(event: T) {
    let self = this;
    (async () => {
      for (let clientId of self.clientIds) {
        await self.sendEvent(clientId, event);
      }
    })();
  }
}
