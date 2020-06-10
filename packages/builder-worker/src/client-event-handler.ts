import { Event } from "./event-bus";

const worker = (self as unknown) as ServiceWorkerGlobalScope;

export class ClientEventHandler {
  private clientIds: Set<string> = new Set();

  constructor() {}

  addClient(clientId: string) {
    this.clientIds.add(clientId);
  }
  removeClient(clientId: string) {
    this.clientIds.delete(clientId);
  }

  async sendEvent<T>(clientId: string, event: Event<T>) {
    let client = await worker.clients.get(clientId);
    if (!client) {
      return;
    }
    client.postMessage(event);
  }

  handleEvent(event: Event<unknown>) {
    let self = this;
    (async () => {
      for (let clientId of self.clientIds) {
        await self.sendEvent(clientId, event);
      }
    })();
  }
}
