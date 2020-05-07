export function assertNever(_value: never): never {
  throw new Error(`not never`);
}
