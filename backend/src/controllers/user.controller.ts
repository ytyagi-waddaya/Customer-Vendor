import { HTTPSTATUS } from "../config/http.config";
import { userService } from "../services/user.service";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { sendResponse } from "../utils/response";
import { Request, Response} from "express";

export const userController = {

register: async(req: Request, res: Response) => {

 const {firstName, lastName, email, password} = req.body;
 
 const user = await userService.register({firstName, lastName, email, password});

  sendResponse({
    res,
    statusCode: HTTPSTATUS.CREATED,
    message: "User Registerd Successfully",
    data: user,
    meta: {
      requestId: req.requestId || "n/a",
    },
  });
},

getUser: async(req: Request, res:Response) => {
 const {id} = req.params
 if(!id){
    throw new BadRequestException("User Id is required")
 }

 const user = await userService.getUserById(id)
 if(!user) {
    throw new NotFoundException(`User with ID ${id} not found`)
 }

  sendResponse({
    res,
    statusCode: HTTPSTATUS.OK,
    message: "User fetched successfully",
    data: user,
    meta: {
      requestId: req.requestId || "n/a",
    },
  });
},

getUsers: async(req: Request, res:Response) => {
 const user = await userService.getUsers()

  sendResponse({
    res,
    statusCode: HTTPSTATUS.OK,
    message: "Users fetched successfully",
    data: user,
    meta: {
      requestId: req.requestId || "n/a",
    },
  });
},

createTempUser : async(req:Request, res:Response) => {
  const {email} = req.body
 const user = await userService.createTempUser(email)
  sendResponse({
    res,
    statusCode: HTTPSTATUS.CREATED,
    message: "User fetched successfully",
    data: user,
    meta: {
      requestId: req.requestId || "n/a",
    },
  }); 
},

login : async(req:Request, res:Response) => {
  const {username, email, password} = req.body

  const response = await userService.login({username, email, password});
  
  sendResponse({
    res,
    statusCode: HTTPSTATUS.OK,
    message: "User logged in successfully",
    data: response,
    meta: {
      requestId: req.requestId || "n/a",
    },
  }); 

},

updateToAdmin: async(req:Request, res:Response) => {
  const {isAdmin} = req.body

  const {id} = req.params

  if(!id){
      throw new BadRequestException("User Id is required")
  }

  if (typeof isAdmin !== "boolean") {
    throw new BadRequestException("isAdmin must be a boolean (true/false)");
  }


   const response = await userService.updateToAdmin(isAdmin, id);
    sendResponse({
    res,
    statusCode: HTTPSTATUS.OK,
    message: "User updated to admin",
    data: response,
    meta: {
      requestId: req.requestId || "n/a",
    },
  }); 
},

details: async(req: Request, res: Response) => {

 const {firstName, lastName, email, password, productname, description} = req.body;
 
 const details = await userService.details({firstName, lastName, email, password}, {productname, description});

  sendResponse({
    res,
    statusCode: HTTPSTATUS.CREATED,
    message: "Details added Successfully",
    data: details,
    meta: {
      requestId: req.requestId || "n/a",
    },
  });
},

}