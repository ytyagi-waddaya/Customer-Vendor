// src/routes/health.route.ts
import { Router, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { sendResponse } from "../utils/response";
import { prisma } from "../utils/prisma"; // Import PrismaClient instance

const router = Router();

// Liveness probe: just checks if process is running
router.get("/live", (_req: Request, res: Response) => {
  sendResponse({
    res,
    statusCode: HTTPSTATUS.OK,
    message: "Liveness probe successful",
    data: {
      status: "UP",
      uptime: process.uptime(),
    },
  });
});

// Readiness probe: checks database connectivity
router.get("/ready", async (_req: Request, res: Response) => {
  try {
    // Simple query to test DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    sendResponse({
      res,
      statusCode: HTTPSTATUS.OK,
      message: "Readiness probe successful",
      data: {
        status: "UP",
        database: "CONNECTED",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    sendResponse({
      res,
      statusCode: HTTPSTATUS.SERVICE_UNAVAILABLE,
      message: "Readiness probe failed",
      data: {
        status: "DOWN",
        database: "FAILED",
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
