"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueUsername = generateUniqueUsername;
const prisma_1 = require("./prisma");
async function generateUniqueUsername(firstName, lastName) {
    const base = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, "");
    let username;
    let exists = true;
    while (exists) {
        const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        username = `${base}${suffix}`;
        // check if already exists
        const user = await prisma_1.prisma.user.findUnique({
            where: { username },
        });
        exists = !!user; // if found, loop again
    }
    return username;
}
//# sourceMappingURL=generateUsername.js.map