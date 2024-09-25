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
exports.main = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CONFIG = {
    url: "https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s",
    folderName: "free_wallpapers",
    filePrefix: "sellout_wallpaper_",
};
async function main() {
    try {
        const res = await fetch(CONFIG.url);
        if (!res.ok) {
            crash(`Failed to fetch wallpaper data: ${res.statusText}`);
        }
        const json = await res.json();
        const data = json?.data;
        if (!Object.hasOwn(json, "data")) {
            crash("Missing 'data' Property");
        }
        const savePath = path.join(process.cwd(), CONFIG.folderName);
        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath);
            console.log(`Initialized directory => ${savePath}`);
        }
        const parsedData = Object.values(data).filter(isWallpaper);
        if (!parsedData.length) {
            crash("No Wallpapers Found");
        }
        console.log(`Total Wallpapers Found: ${parsedData.length}`);
        let index = 1;
        for (const wallpaper of parsedData) {
            if (index < 5) {
                const imageUrl = wallpaper.dhd;
                console.log(`Found Image with URL: ${wallpaper.dhd}`);
                const ext = path.extname(new URL(imageUrl).pathname) || ".jpg";
                const filename = `${CONFIG.filePrefix}${index}${ext}`;
                const filePath = path.join(savePath, filename);
                await downloadImage(imageUrl, filePath);
                console.log(`Saved Image: ${filePath}`);
                index++;
                await delay(100);
            }
        }
    }
    catch (error) {
        crash(error?.message);
    }
}
exports.main = main;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function downloadImage(url, filePath) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);
}
function isWallpaper(arg) {
    return Object.hasOwn(arg, "dhd");
}
function crash(message, code = 1) {
    console.error(message);
    process.exit(code);
}
