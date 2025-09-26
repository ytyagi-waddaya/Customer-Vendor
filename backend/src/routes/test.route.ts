import { Router, Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/response";
import { HTTPSTATUS } from "../config/http.config";
import { BadRequestException } from "../utils/appError"; // or AppError directly

const router = Router();

router.get("/success", (req: Request, res: Response) => {
  const mockData = {
    userId: "12345",
    name: "John Doe",
  };

  sendResponse({
    res,
    statusCode: HTTPSTATUS.OK,
    message: "Test success route works",
    data: mockData,
    meta: {
      requestId: req.headers["x-request-id"] || "n/a",
    },
  });
});

router.get("/error", (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException("This is a test error", undefined, {
      reason: "Just for testing",
    });

});

export default router;
