import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";
import { config } from "../config/app.config";
import logger from "../utils/logger";

const ITSM_MAILBOX = config.SENDER_EMAIL;

const credential = new ClientSecretCredential(
  config.AZURE_TENANT_ID!,
  config.AZURE_CLIENT_ID!,
  config.AZURE_CLIENT_SECRET!
);

export const client = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const token = await credential.getToken("https://graph.microsoft.com/.default");
      if (!token?.token) throw new Error("Failed to get Graph token");
      return token.token;
    },
  },
});

export const sendGraphMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await client.api(`/users/${ITSM_MAILBOX}/sendMail`).post({
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

    logger.info(`✅ Mail sent successfully to ${to}`);
  } catch (error: any) {
    logger.error(`❌ Failed to send mail to ${to}`, error.message || error);
    throw error;
  }
};
