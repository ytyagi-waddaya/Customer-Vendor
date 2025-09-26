"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/health.route.ts
const express_1 = require("express");
const http_config_1 = require("../config/http.config");
const response_1 = require("../utils/response");
const prisma_1 = require("../utils/prisma"); // Import PrismaClient instance
const router = (0, express_1.Router)();
// Liveness probe: just checks if process is running
router.get("/live", (_req, res) => {
    (0, response_1.sendResponse)({
        res,
        statusCode: http_config_1.HTTPSTATUS.OK,
        message: "Liveness probe successful",
        data: {
            status: "UP",
            uptime: process.uptime(),
        },
    });
});
// Readiness probe: checks database connectivity
router.get("/ready", async (_req, res) => {
    try {
        // Simple query to test DB connectivity
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.OK,
            message: "Readiness probe successful",
            data: {
                status: "UP",
                database: "CONNECTED",
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (err) {
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.SERVICE_UNAVAILABLE,
            message: "Readiness probe failed",
            data: {
                status: "DOWN",
                database: "FAILED",
                timestamp: new Date().toISOString(),
            },
        });
    }
});
exports.default = router;
//# sourceMappingURL=health.route.js.map