"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const http_config_1 = require("../config/http.config");
const sendResponse = ({ res, statusCode = http_config_1.HTTPSTATUS.OK, success = true, message, data, meta, requestId, }) => {
    const response = {
        success,
        message,
        statusCode,
        statusText: http_config_1.HttpStatusMessageMap[statusCode] || "Unknown Status",
        timestamp: new Date().toISOString(),
        requestId: requestId ?? res.locals.requestId, // fallback to middleware-generated ID
    };
    if (data !== undefined)
        response.data = data;
    if (meta && Object.keys(meta).length > 0)
        response.meta = meta;
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=response.js.map