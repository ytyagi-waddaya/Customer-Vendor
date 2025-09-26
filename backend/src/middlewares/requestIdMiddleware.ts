// import { v4 as uuid } from "uuid";
// import { Request, Response, NextFunction } from "express";

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


import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";

// Extend the Request type globally (better than inline)
declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incomingRequestId = req.header("x-request-id"); // case-insensitive
  const requestId = incomingRequestId || uuid();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
};
