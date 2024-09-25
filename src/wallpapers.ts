import * as fs from "fs";
import * as path from "path";
import { CONFIG } from "./config";
import { STORE } from "./lib";
import { isWallpaper } from "./types";
import { crash, downloadImage, extractFilename, getImageExt } from "./util";
import { logger } from "./util/logger";

export async function retrieveWallpapers(): Promise<void> {
  try {
    logger("*****Attempting to scrape 'underpriced' wallpapers*****")
    let res: any = await fetch(CONFIG.url);
    if (!res.ok) {
      logger(
        `Failed to fetch wallpaper data: ${res.statusText}. Reverting to store...`,
        "Red"
      );
      res = STORE;
    }

    let data;
    if (res instanceof Response) {
      const json = await res.json();
      if (Object.hasOwn(json, "data")) {
        data = json.data;
      } else {
        logger("Missing 'data' Property. Reverting to store...", "Yellow");
        data = STORE.data;
      }
    } else {
      data = res.data;
    }

    const savePath = path.join(process.cwd(), CONFIG.folderName);
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
      logger(`Initialized directory => ${savePath}`);
    }

    const wallpaperURLs = Object.values(data)
      .filter(isWallpaper)
      .map(({ dhd }) => dhd);
    if (!wallpaperURLs.length) {
      crash("No Wallpapers Found");
    }

    const uniqueWallpaperURLs = Array.from(new Set(wallpaperURLs));
    logger(`Total Wallpapers Found: ${uniqueWallpaperURLs.length}`, "Blue");

    const maxDownloads: number = CONFIG.maxDownloads;
    const URLs =
      maxDownloads == -1 || maxDownloads == 0
        ? uniqueWallpaperURLs
        : uniqueWallpaperURLs.slice(0, maxDownloads);

    for (const [index, url] of URLs.entries()) {
      try {
        logger(`Found Image with URL: ${url}`, "Yellow");

        const ext = getImageExt(url);
        const fileName = `${
          extractFilename(url) || CONFIG.filePrefix.concat(index as any)
        }${ext}`;
        const filePath = path.join(savePath, fileName);

        await downloadImage(url, filePath);
        logger(`Saved Image: ${filePath}`, "Green");
      } catch (error) {
        logger(
          `Failed to download image ${index}: ${(error as Error).message}`,
          "Red"
        );
      }
    }

    logger("Wallpapers processed successfully", "Blue");
  } catch (error) {
    crash(`Fatal Error: ${(error as Error)?.message}`);
  }
}
