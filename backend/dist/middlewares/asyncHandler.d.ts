import { NextFunction, Request, Response } from 'express';
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const asyncHandler: (controller: AsyncController) => AsyncController;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map