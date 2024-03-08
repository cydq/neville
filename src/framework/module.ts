import type { Client } from "discord.js";
import { __type__, type ModuleHandleError } from "scarf";
import type { Result } from "tsfy";

export type ModuleHandleResult = Result<void, ModuleHandleError>;

export interface Module {
  [__type__]: "module";
  handle(client: Client): Promise<ModuleHandleResult>;
}

export function createModule(
  fn: (client: Client) => ModuleHandleResult | Promise<ModuleHandleResult>,
): Module {
  return {
    [__type__]: "module",
    handle: async (client: Client) => await fn(client),
  };
}
