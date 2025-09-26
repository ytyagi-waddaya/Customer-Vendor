export interface AppConfig {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    LOG_LEVEL?: string;
    FRONTEND_ORIGIN?: string;
    JWT_SECRET: string;
    AZURE_TENANT_ID: string;
    AZURE_CLIENT_ID: string;
    AZURE_CLIENT_SECRET: string;
    SENDER_EMAIL: string;
}
export declare const config: AppConfig;
//# sourceMappingURL=app.config.d.ts.map