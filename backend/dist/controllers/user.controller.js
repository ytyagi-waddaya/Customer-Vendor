"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_config_1 = require("../config/http.config");
const user_service_1 = require("../services/user.service");
const appError_1 = require("../utils/appError");
const response_1 = require("../utils/response");
exports.userController = {
    register: async (req, res) => {
        const { firstName, lastName, email, password } = req.body;
        const user = await user_service_1.userService.register({ firstName, lastName, email, password });
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.CREATED,
            message: "User Registerd Successfully",
            data: user,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
    getUser: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            throw new appError_1.BadRequestException("User Id is required");
        }
        const user = await user_service_1.userService.getUserById(id);
        if (!user) {
            throw new appError_1.NotFoundException(`User with ID ${id} not found`);
        }
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.OK,
            message: "User fetched successfully",
            data: user,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
    getUsers: async (req, res) => {
        const user = await user_service_1.userService.getUsers();
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.OK,
            message: "Users fetched successfully",
            data: user,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
    createTempUser: async (req, res) => {
        const { email } = req.body;
        const user = await user_service_1.userService.createTempUser(email);
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.CREATED,
            message: "User fetched successfully",
            data: user,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
    login: async (req, res) => {
        const { username, email, password } = req.body;
        const response = await user_service_1.userService.login({ username, email, password });
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.OK,
            message: "User logged in successfully",
            data: response,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
    updateToAdmin: async (req, res) => {
        const { isAdmin } = req.body;
        const { id } = req.params;
        if (!id) {
            throw new appError_1.BadRequestException("User Id is required");
        }
        if (typeof isAdmin !== "boolean") {
            throw new appError_1.BadRequestException("isAdmin must be a boolean (true/false)");
        }
        const response = await user_service_1.userService.updateToAdmin(isAdmin, id);
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.OK,
            message: "User updated to admin",
            data: response,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
    details: async (req, res) => {
        const { firstName, lastName, email, password, productname, description } = req.body;
        const details = await user_service_1.userService.details({ firstName, lastName, email, password }, { productname, description });
        (0, response_1.sendResponse)({
            res,
            statusCode: http_config_1.HTTPSTATUS.CREATED,
            message: "Details added Successfully",
            data: details,
            meta: {
                requestId: req.requestId || "n/a",
            },
        });
    },
};
//# sourceMappingURL=user.controller.js.map