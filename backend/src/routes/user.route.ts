import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/temp-user", asyncHandler(userController.createTempUser));
router.post("/login", asyncHandler(userController.login));
router.post("/register", requireAuth, asyncHandler(userController.register));
router.post("/details", requireAuth, asyncHandler(userController.details));
router.get("/users", requireAuth, asyncHandler(userController.getUsers));
router.get("/:id", requireAuth, asyncHandler(userController.getUser));
router.patch("/:id/update-to-admin", requireAuth, asyncHandler(userController.updateToAdmin));

export default router;
