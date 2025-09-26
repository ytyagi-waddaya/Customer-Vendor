"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/temp-user", (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.createTempUser));
router.post("/login", (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.login));
router.post("/register", authMiddleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.register));
router.post("/details", authMiddleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.details));
router.get("/users", authMiddleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getUsers));
router.get("/:id", authMiddleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getUser));
router.patch("/:id/update-to-admin", authMiddleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.updateToAdmin));
exports.default = router;
//# sourceMappingURL=user.route.js.map