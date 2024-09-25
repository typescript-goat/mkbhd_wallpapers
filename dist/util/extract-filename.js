"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFilename = void 0;
function extractFilename(url) {
    const filenameRegex = /\/([^\/]+)\.[^\.]+\?/;
    const match = url.match(filenameRegex);
    if (match && match[1]) {
        let filename = match[1];
        return filename.replace(/[^a-zA-Z0-9]/g, "_");
    }
}
exports.extractFilename = extractFilename;
