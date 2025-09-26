"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = require("../config/app.config");
const JWT_SECRET = app_config_1.config.JWT_SECRET;
const generateJwtToken = (payload) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};
exports.generateJwtToken = generateJwtToken;
//# sourceMappingURL=jwt.js.map