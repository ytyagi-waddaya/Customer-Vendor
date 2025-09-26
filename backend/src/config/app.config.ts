import  {getEnv}  from "../utils/get-env";

export interface AppConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  LOG_LEVEL?: string;
  FRONTEND_ORIGIN?:string
  JWT_SECRET:string
  AZURE_TENANT_ID: string;
  AZURE_CLIENT_ID: string;
  AZURE_CLIENT_SECRET: string;
  SENDER_EMAIL:string;
}

const appConfig = (): AppConfig => ({
  NODE_ENV: getEnv("NODE_ENV", "development") as AppConfig["NODE_ENV"],
  PORT: Number(getEnv("PORT")),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
  FRONTEND_ORIGIN:getEnv("FRONTEND_ORIGIN"),
  JWT_SECRET:getEnv("JWT_SECRET"),
  AZURE_TENANT_ID: getEnv("AZURE_TENANT_ID"),
  AZURE_CLIENT_ID: getEnv("AZURE_CLIENT_ID"),
  AZURE_CLIENT_SECRET: getEnv("AZURE_CLIENT_SECRET"),
  SENDER_EMAIL: getEnv("SENDER_EMAIL")
});

export const config = appConfig();
