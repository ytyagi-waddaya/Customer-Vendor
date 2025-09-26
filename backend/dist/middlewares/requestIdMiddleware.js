"use strict";
// import { v4 as uuid } from "uuid";
// import { Request, Response, NextFunction } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
// export const requestIdMiddleware = (
//   req: Request & { requestId?: string },
//   res: Response,
//   next: NextFunction
// ) => {
//   const requestId = uuid();
//   req.requestId = requestId;
//   res.setHeader("X-Request-ID", requestId);
//   next();
// };
const uuid_1 = require("uuid");
const requestIdMiddleware = (req, res, next) => {
    const incomingRequestId = req.header("x-request-id"); // case-insensitive
    const requestId = incomingRequestId || (0, uuid_1.v4)();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
//# sourceMappingURL=requestIdMiddleware.js.map