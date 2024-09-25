"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const ASCIIColors = {
    Black: 30,
    Red: 31,
    Green: 32,
    Yellow: 33,
    Blue: 34,
    Magenta: 35,
    Cyan: 36,
    White: 37,
};
function logger(log, color = "White") {
    console.log(`\x1b[${ASCIIColors[color]}m%s\x1b[0m`, `${log}`);
}
exports.logger = logger;
