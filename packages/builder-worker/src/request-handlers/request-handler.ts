export type Handler = (event: FetchEvent) => Promise<Response | undefined>;
