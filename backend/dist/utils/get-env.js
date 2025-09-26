"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const getEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (value !== undefined)
        return value;
    if (defaultValue !== undefined) {
        console.warn(`Environment variable ${key} not set. Using default: ${defaultValue}`);
        return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
};
exports.getEnv = getEnv;
//# sourceMappingURL=get-env.js.map