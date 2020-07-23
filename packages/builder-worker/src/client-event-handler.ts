import { Event } from "./event-bus";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

// TODO merge this logic into the event bus
export class ClientEventHandler {
  private clientIds: Set<string> = new Set();

  constructor() {}

  addClient(clientId: string) {
    this.clientIds.add(clientId);
  }
  removeClient(clientId: string) {
    this.clientIds.delete(clientId);
  }

  async sendEvent(clientId: string, event: Event) {
    let client = await worker.clients.get(clientId);
    if (!client) {
      return;
    }
    client.postMessage(event);
  }

  handleEvent(event: Event) {
    let self = this;
    (async () => {
      for (let clientId of self.clientIds) {
        await self.sendEvent(clientId, event);
      }
    })();
  }
}
