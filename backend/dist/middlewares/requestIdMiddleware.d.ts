import { Request, Response, NextFunction } from "express";
declare module "express-serve-static-core" {
    interface Request {
        requestId?: string;
    }
}
export declare const requestIdMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestIdMiddleware.d.ts.map