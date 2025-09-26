"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const prisma_1 = require("./utils/prisma");
const PORT = process.env.PORT || 8000;
let server;
// ---------- Animated Step Runner ----------
const runStep = async (step) => {
    const frames = [" .", " ..", " ...", " ...."];
    let i = 0;
    process.stdout.write(`[STEP] ${step.label}`);
    const start = Date.now();
    const interval = setInterval(() => {
        process.stdout.write(`\r[STEP] ${step.label}${frames[i % frames.length]}`);
        i++;
    }, 200);
    const timeoutPromise = step.maxDurationMs
        ? new Promise((_, reject) => setTimeout(() => reject(new Error("Step timed out")), step.maxDurationMs))
        : null;
    try {
        const taskPromise = step.task();
        await (timeoutPromise ? Promise.race([taskPromise, timeoutPromise]) : taskPromise);
        // Ensure minimum duration is respected
        const elapsed = Date.now() - start;
        const minDuration = step.minDurationMs ?? 800;
        if (elapsed < minDuration)
            await new Promise((r) => setTimeout(r, minDuration - elapsed));
        clearInterval(interval);
        const doneMsg = `[STEP] ${step.label} DONE`;
        process.stdout.write(`\r${doneMsg}\n`);
        logger_1.default.info(doneMsg);
    }
    catch (err) {
        clearInterval(interval);
        const failMsg = `[STEP] ${step.label} FAILED`;
        process.stdout.write(`\r${failMsg}\n`);
        logger_1.default.error(failMsg, { error: err });
        throw err;
    }
};
// ---------- Graceful Shutdown ----------
const gracefulShutdown = async (signal) => {
    logger_1.default.warn(`[SHUTDOWN] Received ${signal}. Starting graceful shutdown...`);
    // Force exit after 10s if shutdown hangs
    const forceExitTimeout = setTimeout(() => {
        logger_1.default.error("[SHUTDOWN] Shutdown timed out. Forcing exit...");
        process.exit(1);
    }, 10_000).unref();
    const shutdownSteps = [
        {
            label: "Closing database connection",
            task: async () => await prisma_1.prisma.$disconnect(),
            minDurationMs: 800,
            maxDurationMs: 5000,
        },
        {
            label: "Stopping HTTP server",
            task: async () => server
                ? new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => resolve(), 5000); // fallback
                    server.close((err) => {
                        clearTimeout(timeout);
                        err ? reject(err) : resolve();
                    });
                })
                : Promise.resolve(),
            minDurationMs: 800,
            maxDurationMs: 5000,
        },
        {
            label: "Cleaning up cache",
            task: async () => new Promise((r) => setTimeout(r, 1000)),
            minDurationMs: 800,
            maxDurationMs: 3000,
        },
    ];
    try {
        for (const step of shutdownSteps) {
            await runStep(step);
        }
        clearTimeout(forceExitTimeout);
        logger_1.default.info("[SHUTDOWN] Graceful shutdown completed. Exiting.");
        process.exit(0);
    }
    catch (err) {
        clearTimeout(forceExitTimeout);
        logger_1.default.error("[SHUTDOWN] Error during shutdown", { error: err });
        process.exit(1);
    }
};
// ---------- Signal Handlers ----------
["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => gracefulShutdown(sig)));
// ---------- Uncaught Exceptions / Rejections ----------
process.on("uncaughtException", (err) => {
    logger_1.default.error("Uncaught Exception", { error: err });
    gracefulShutdown("uncaughtException").catch(() => process.exit(1));
});
process.on("unhandledRejection", (reason) => {
    logger_1.default.error("Unhandled Promise Rejection", { reason });
    gracefulShutdown("unhandledRejection").catch(() => process.exit(1));
});
// ---------- Bootstrap Server ----------
const startServer = async () => {
    const startupSteps = [
        {
            label: "Connecting to database",
            task: async () => await prisma_1.prisma.$connect(),
            minDurationMs: 800,
            maxDurationMs: 5000,
        },
        {
            label: "Starting HTTP server",
            task: async () => new Promise((resolve) => {
                server = app_1.default.listen(PORT, () => resolve());
            }),
            minDurationMs: 800,
            maxDurationMs: 5000,
        },
    ];
    try {
        for (const step of startupSteps) {
            await runStep(step);
        }
        logger_1.default.info(`Server running on port ${PORT}`);
    }
    catch (err) {
        logger_1.default.error("Failed to start server", { error: err });
        await prisma_1.prisma.$disconnect();
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map