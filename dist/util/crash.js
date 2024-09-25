"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crash = void 0;
const logger_1 = require("./logger");
function crash(message, code = 1) {
    (0, logger_1.logger)(message, "Red");
    process.exit(code);
}
exports.crash = crash;
