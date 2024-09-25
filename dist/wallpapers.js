"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveWallpapers = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = require("./config");
const lib_1 = require("./lib");
const types_1 = require("./types");
const util_1 = require("./util");
const logger_1 = require("./util/logger");
async function retrieveWallpapers() {
    try {
        (0, logger_1.logger)("*****Attempting to scrape 'underpriced' wallpapers*****");
        let res = await fetch(config_1.CONFIG.url);
        if (!res.ok) {
            (0, logger_1.logger)(`Failed to fetch wallpaper data: ${res.statusText}. Reverting to store...`, "Red");
            res = lib_1.STORE;
        }
        let data;
        if (res instanceof Response) {
            const json = await res.json();
            if (Object.hasOwn(json, "data")) {
                data = json.data;
            }
            else {
                (0, logger_1.logger)("Missing 'data' Property. Reverting to store...", "Yellow");
                data = lib_1.STORE.data;
            }
        }
        else {
            data = res.data;
        }
        const savePath = path.join(process.cwd(), config_1.CONFIG.folderName);
        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath);
            (0, logger_1.logger)(`Initialized directory => ${savePath}`);
        }
        const wallpaperURLs = Object.values(data)
            .filter(types_1.isWallpaper)
            .map(({ dhd }) => dhd);
        if (!wallpaperURLs.length) {
            (0, util_1.crash)("No Wallpapers Found");
        }
        const uniqueWallpaperURLs = Array.from(new Set(wallpaperURLs));
        (0, logger_1.logger)(`Total Wallpapers Found: ${uniqueWallpaperURLs.length}`, "Blue");
        const maxDownloads = config_1.CONFIG.maxDownloads;
        const URLs = maxDownloads == -1 || maxDownloads == 0
            ? uniqueWallpaperURLs
            : uniqueWallpaperURLs.slice(0, maxDownloads);
        for (const [index, url] of URLs.entries()) {
            try {
                (0, logger_1.logger)(`Found Image with URL: ${url}`, "Yellow");
                const ext = (0, util_1.getImageExt)(url);
                const fileName = `${(0, util_1.extractFilename)(url) || config_1.CONFIG.filePrefix.concat(index)}${ext}`;
                const filePath = path.join(savePath, fileName);
                await (0, util_1.downloadImage)(url, filePath);
                (0, logger_1.logger)(`Saved Image: ${filePath}`, "Green");
            }
            catch (error) {
                (0, logger_1.logger)(`Failed to download image ${index}: ${error.message}`, "Red");
            }
        }
        (0, logger_1.logger)("Wallpapers processed successfully", "Blue");
    }
    catch (error) {
        (0, util_1.crash)(`Fatal Error: ${error?.message}`);
    }
}
exports.retrieveWallpapers = retrieveWallpapers;
