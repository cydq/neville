import * as fs from "node:fs/promises";
import type { Client } from "discord.js";
import { Err, Ok, type Result } from "tsfy";
import { __type__, type Module } from "scarf";
import * as path from "path";

const isModule = (module: unknown): module is Module =>
  typeof module === "object" &&
  module !== null &&
  __type__ in module &&
  module[__type__] === "module";

export async function loadModules(
  client: Client,
  paths: string[],
): Promise<Result<number, unknown>> {
  try {
    let count = 0;

    for (const path of paths) {
      // const files = await fs.readdir(path, { recursive: true });

      for await (const file of walk(path)) {
        if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

        const { default: module } = await import(file);
        if (!module || !isModule(module)) continue;

        const result = await module.handle(client);
        if (result.isErr()) return Err(result.unwrapErr());

        count++;
      }
    }

    return Ok(count);
  } catch (e) {
    return Err(e);
  }
}

async function* walk(dir: string): AsyncGenerator<string> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walk(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}
