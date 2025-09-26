export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUser {
  firstName:string, 
  lastName: string,
  email: string;
  password: string;
  username: string;
}

export interface CreateTempUser {
  username: string;
  tempPassword: string;
}

export interface LoginUser {
  username: string;
  email: string;
  password: string;
}

export interface CreateDetailsInput{
  userId: string;
  productname: string;
  description: string;
}

export interface CreateDetails{
  productname: string;
  description: string;
}