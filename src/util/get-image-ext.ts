import * as path from "path";
import { CONFIG } from "../config";

export function getImageExt(url: string): string {
  return path.extname(new URL(url).pathname) || CONFIG.fallbackExt;
}
