import { CreateDetails, CreateDetailsInput, CreateTempUser, CreateUser } from "../types/user";
import { prisma } from "../utils/prisma";

export const userRepository = {
create : ({firstName, lastName, email, password, username}: CreateUser) => {
    return prisma.user.create({
        data:{
            firstName, 
            lastName,
            email, 
            password,
            username,
        }
    })
},

  getById: (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },

  getUsers: () => {
    return prisma.user.findMany();
  },

  getByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  getByEmailOrUsername: (email: string, username:string) => {
    return prisma.user.findFirst({
    where: {
      OR: [
        username ? { username } : {},
        email ? { email } : {},
      ],
    },
  });

  },

  createTempUser: ({ username, tempPassword }: CreateTempUser) => {
    return prisma.user.create({
      data: {
        username,
        tempPassword,
          // ⏳ Set expiration = now + 24 hours
        tempExpiresAt:  new Date(Date.now() + 24 * 60 * 60 * 1000),
        isTempUser: true,
      },
    });
  },


  UpdateToAdmin : (isAdmin:boolean, userId:string) => {
    return prisma.user.update({
      where:{
        id: userId
      },
      data:{
        isAdmin
      }
    })
  },

createDetails: ({ userId, productname, description }: CreateDetailsInput) => {
  return prisma.detail.create({
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

