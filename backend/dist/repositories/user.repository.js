"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("../utils/prisma");
exports.userRepository = {
    create: ({ firstName, lastName, email, password, username }) => {
        return prisma_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                username,
            }
        });
    },
    getById: (id) => {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    },
    getUsers: () => {
        return prisma_1.prisma.user.findMany();
    },
    getByEmail: (email) => {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    },
    getByEmailOrUsername: (email, username) => {
        return prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    username ? { username } : {},
                    email ? { email } : {},
                ],
            },
        });
    },
    createTempUser: ({ username, tempPassword }) => {
        return prisma_1.prisma.user.create({
            data: {
                username,
                tempPassword,
                // ⏳ Set expiration = now + 24 hours
                tempExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                isTempUser: true,
            },
        });
    },
    UpdateToAdmin: (isAdmin, userId) => {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isAdmin
            }
        });
    },
    createDetails: ({ userId, productname, description }) => {
        return prisma_1.prisma.detail.create({
            data: {
                productname,
                description,
                user: {
                    connect: { id: userId },
                },
            },
        });
    },
};
//# sourceMappingURL=user.repository.js.map