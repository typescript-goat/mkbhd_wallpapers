import { logger } from "./logger";

export function crash(message: string, code: number = 1): never {
  logger(message, "Red");
  process.exit(code);
}
