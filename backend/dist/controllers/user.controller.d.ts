import { Request, Response } from "express";
export declare const userController: {
    register: (req: Request, res: Response) => Promise<void>;
    getUser: (req: Request, res: Response) => Promise<void>;
    getUsers: (req: Request, res: Response) => Promise<void>;
    createTempUser: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    updateToAdmin: (req: Request, res: Response) => Promise<void>;
    details: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map