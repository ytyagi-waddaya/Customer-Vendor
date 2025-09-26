"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGraphMail = exports.client = void 0;
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const identity_1 = require("@azure/identity");
require("isomorphic-fetch");
const app_config_1 = require("../config/app.config");
const logger_1 = __importDefault(require("../utils/logger"));
const ITSM_MAILBOX = app_config_1.config.SENDER_EMAIL;
const credential = new identity_1.ClientSecretCredential(app_config_1.config.AZURE_TENANT_ID, app_config_1.config.AZURE_CLIENT_ID, app_config_1.config.AZURE_CLIENT_SECRET);
exports.client = microsoft_graph_client_1.Client.initWithMiddleware({
    authProvider: {
        getAccessToken: async () => {
            const token = await credential.getToken("https://graph.microsoft.com/.default");
            if (!token?.token)
                throw new Error("Failed to get Graph token");
            return token.token;
        },
    },
});
const sendGraphMail = async ({ to, subject, html, }) => {
    try {
        await exports.client.api(`/users/${ITSM_MAILBOX}/sendMail`).post({
            message: {
                subject,
                body: {
                    contentType: "HTML",
                    content: html,
                },
                toRecipients: [
                    {
                        emailAddress: { address: to },
                    },
                ],
            },
            saveToSentItems: true, // optional
        });
        logger_1.default.info(`✅ Mail sent successfully to ${to}`);
    }
    catch (error) {
        logger_1.default.error(`❌ Failed to send mail to ${to}`, error.message || error);
        throw error;
    }
};
exports.sendGraphMail = sendGraphMail;
//# sourceMappingURL=mail.js.map