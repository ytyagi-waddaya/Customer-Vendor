"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const http_config_1 = require("../config/http.config");
const appError_1 = require("../utils/appError"); // or AppError directly
const router = (0, express_1.Router)();
router.get("/success", (req, res) => {
    const mockData = {
        userId: "12345",
        name: "John Doe",
    };
    (0, response_1.sendResponse)({
        res,
        statusCode: http_config_1.HTTPSTATUS.OK,
        message: "Test success route works",
        data: mockData,
        meta: {
            requestId: req.headers["x-request-id"] || "n/a",
        },
    });
});
router.get("/error", (req, res, next) => {
    throw new appError_1.BadRequestException("This is a test error", undefined, {
        reason: "Just for testing",
    });
});
exports.default = router;
//# sourceMappingURL=test.route.js.map