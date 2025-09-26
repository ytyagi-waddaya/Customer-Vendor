import { userRepository } from "../repositories/user.repository";
import { CreateDetails, CreateDetailsInput, CreateUser, CreateUserInput, LoginUser } from "../types/user";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError"
import bcrypt from "bcrypt"
import { generateJwtToken } from "../utils/jwt";
import { generateUniqueUsername } from "../utils/generateUsername";
import { sendGraphMail } from "../utils/mail";

export const userService = {

register: async (input: CreateUserInput) => {
  const { firstName, lastName, email, password } = input;

  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestException("Name, email, and password are required");
  }

  // 🔹 STEP 1: Check in SAP MasterDB
  // const sapUser = await sapRepository.findUserByEmail(email);
  // if (sapUser) {
  //   throw new BadRequestException(`User with ${email} already exists in SAP MasterDB. Registration not allowed.`);
  // }

  // 🔹 STEP 2: Check in Local DB
  const localUser = await userRepository.getByEmail(email);
  if (localUser) {
    throw new BadRequestException(`User with ${email} already exists in local DB.`);
  }

  // 🔹 STEP 3: Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 🔹 STEP 4: Generate username
  const username = await generateUniqueUsername(firstName, lastName);

  // 🔹 STEP 5: Save in Local DB
  const newUser = await userRepository.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
    username,
  });

  // 🔹 STEP 6: Send Credentials Email
  await sendGraphMail({
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

 getUserById: async(id:string) => {
    const response = await userRepository.getById(id)
    return response
 },

 getUsers: async() => {
    const response = await userRepository.getUsers()
    return response
 },

 getUserByEmail: async(email:string) => {
    const response = await userRepository.getByEmail(email)
    return response
 },

createTempUser : async (email: string) => {
  const user = await userRepository.getByEmail(email);
  if (user) {
    throw new BadRequestException(`User with ${email} already exist.`);
  }

  const username = "USR" + Math.floor(100000 + Math.random() * 900000);
  const rawPassword = Math.random().toString(36).slice(-8);
  const tempPassword = await bcrypt.hash(rawPassword, 10);

  const response = await userRepository.createTempUser({
    username,
    tempPassword: tempPassword,
  });

  // 📧 Send credentials email
  await sendGraphMail({
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

login: async ({ username, email, password }: LoginUser) => {
  if ((!username && !email) || !password) {
    throw new BadRequestException("Either Username or Email and Password are required");
  }

  const user = await userRepository.getByEmailOrUsername(email, username);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  // ⏳ Check if it's a temp user and expired
  if (user.isTempUser && user.tempExpiresAt) {
    const now = new Date();
    if (now > user.tempExpiresAt) {
      throw new UnauthorizedException("Temporary credientials  has expired. Please contact the admin.");
    }
  }

  const storedPassword = user.password || user.tempPassword;
  if (!storedPassword) {
    throw new UnauthorizedException("No password set for this user");
  }

  const isMatch = await bcrypt.compare(password, storedPassword);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const token = generateJwtToken({ id: user.id });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token,
  };
},

updateToAdmin: async(isAdmin:boolean, userId:string) => {
  const user =  await userRepository.getById(userId)
  if(!user){
    throw new NotFoundException(`User with ${userId} not found`)
  }

  return userRepository.UpdateToAdmin(isAdmin, userId);

},

details: async (input: CreateUserInput, details: CreateDetails) => {
  const { productname, description } = details;

  const userresponse = await userService.register(input);

  if (!userresponse) throw new BadRequestException ("User registration failed");


  const detailsresponse = await userRepository.createDetails({
    productname,
    description,
    userId: userresponse.id,
  });

  return { userresponse, detailsresponse };
},

}