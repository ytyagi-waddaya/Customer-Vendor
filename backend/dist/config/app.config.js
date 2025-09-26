"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const get_env_1 = require("../utils/get-env");
const appConfig = () => ({
    NODE_ENV: (0, get_env_1.getEnv)("NODE_ENV", "development"),
    PORT: Number((0, get_env_1.getEnv)("PORT")),
    LOG_LEVEL: (0, get_env_1.getEnv)("LOG_LEVEL", "info"),
    FRONTEND_ORIGIN: (0, get_env_1.getEnv)("FRONTEND_ORIGIN"),
    JWT_SECRET: (0, get_env_1.getEnv)("JWT_SECRET"),
    AZURE_TENANT_ID: (0, get_env_1.getEnv)("AZURE_TENANT_ID"),
    AZURE_CLIENT_ID: (0, get_env_1.getEnv)("AZURE_CLIENT_ID"),
    AZURE_CLIENT_SECRET: (0, get_env_1.getEnv)("AZURE_CLIENT_SECRET"),
    SENDER_EMAIL: (0, get_env_1.getEnv)("SENDER_EMAIL")
});
exports.config = appConfig();
//# sourceMappingURL=app.config.js.map