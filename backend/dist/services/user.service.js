"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const appError_1 = require("../utils/appError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const generateUsername_1 = require("../utils/generateUsername");
const mail_1 = require("../utils/mail");
exports.userService = {
    register: async (input) => {
        const { firstName, lastName, email, password } = input;
        if (!firstName || !lastName || !email || !password) {
            throw new appError_1.BadRequestException("Name, email, and password are required");
        }
        // 🔹 STEP 1: Check in SAP MasterDB
        // const sapUser = await sapRepository.findUserByEmail(email);
        // if (sapUser) {
        //   throw new BadRequestException(`User with ${email} already exists in SAP MasterDB. Registration not allowed.`);
        // }
        // 🔹 STEP 2: Check in Local DB
        const localUser = await user_repository_1.userRepository.getByEmail(email);
        if (localUser) {
            throw new appError_1.BadRequestException(`User with ${email} already exists in local DB.`);
        }
        // 🔹 STEP 3: Hash password
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // 🔹 STEP 4: Generate username
        const username = await (0, generateUsername_1.generateUniqueUsername)(firstName, lastName);
        // 🔹 STEP 5: Save in Local DB
        const newUser = await user_repository_1.userRepository.create({
            firstName,
            lastName,
            email,
            password: passwordHash,
            username,
        });
        // 🔹 STEP 6: Send Credentials Email
        await (0, mail_1.sendGraphMail)({
            to: email,
            subject: "Your Temporary Account Credentials",
            html: `
      <p>Hello, ${firstName} ${lastName}</p>
      <p>Use the following credentials to log in:</p>
      <ul>
        <li><b>Username:</b> ${username}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Password:</b> ${password}</li>
      </ul>
      <p>Please change your password after first login.</p>
    `,
        });
        return newUser;
    },
    getUserById: async (id) => {
        const response = await user_repository_1.userRepository.getById(id);
        return response;
    },
    getUsers: async () => {
        const response = await user_repository_1.userRepository.getUsers();
        return response;
    },
    getUserByEmail: async (email) => {
        const response = await user_repository_1.userRepository.getByEmail(email);
        return response;
    },
    createTempUser: async (email) => {
        const user = await user_repository_1.userRepository.getByEmail(email);
        if (user) {
            throw new appError_1.BadRequestException(`User with ${email} already exist.`);
        }
        const username = "USR" + Math.floor(100000 + Math.random() * 900000);
        const rawPassword = Math.random().toString(36).slice(-8);
        const tempPassword = await bcrypt_1.default.hash(rawPassword, 10);
        const response = await user_repository_1.userRepository.createTempUser({
            username,
            tempPassword: tempPassword,
        });
        // 📧 Send credentials email
        await (0, mail_1.sendGraphMail)({
            to: email,
            subject: "Your Temporary Account Credentials",
            html: `
      <p>Hello,</p>
      <p>Your temporary account has been created. Use the following credentials to log in:</p>
      <ul>
        <li><b>Username:</b> ${username}</li>
        <li><b>Password:</b> ${rawPassword}</li>
      </ul>
      <p><b>Note:</b> This account is valid for 24 hours. Please complete your registration before it expires.</p>
    `,
        });
        return {
            ...response,
            rawPassword, // in case you still want to return it (optional)
        };
    },
    login: async ({ username, email, password }) => {
        if ((!username && !email) || !password) {
            throw new appError_1.BadRequestException("Either Username or Email and Password are required");
        }
        const user = await user_repository_1.userRepository.getByEmailOrUsername(email, username);
        if (!user) {
            throw new appError_1.NotFoundException("User not found");
        }
        // ⏳ Check if it's a temp user and expired
        if (user.isTempUser && user.tempExpiresAt) {
            const now = new Date();
            if (now > user.tempExpiresAt) {
                throw new appError_1.UnauthorizedException("Temporary credientials  has expired. Please contact the admin.");
            }
        }
        const storedPassword = user.password || user.tempPassword;
        if (!storedPassword) {
            throw new appError_1.UnauthorizedException("No password set for this user");
        }
        const isMatch = await bcrypt_1.default.compare(password, storedPassword);
        if (!isMatch) {
            throw new appError_1.UnauthorizedException("Invalid credentials");
        }
        const token = (0, jwt_1.generateJwtToken)({ id: user.id });
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token,
        };
    },
    updateToAdmin: async (isAdmin, userId) => {
        const user = await user_repository_1.userRepository.getById(userId);
        if (!user) {
            throw new appError_1.NotFoundException(`User with ${userId} not found`);
        }
        return user_repository_1.userRepository.UpdateToAdmin(isAdmin, userId);
    },
    details: async (input, details) => {
        const { productname, description } = details;
        const userresponse = await exports.userService.register(input);
        if (!userresponse)
            throw new appError_1.BadRequestException("User registration failed");
        const detailsresponse = await user_repository_1.userRepository.createDetails({
            productname,
            description,
            userId: userresponse.id,
        });
        return { userresponse, detailsresponse };
    },
};
//# sourceMappingURL=user.service.js.map