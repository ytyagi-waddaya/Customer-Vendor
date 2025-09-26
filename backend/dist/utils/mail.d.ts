import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
export declare const client: Client;
export declare const sendGraphMail: ({ to, subject, html, }: {
    to: string;
    subject: string;
    html: string;
}) => Promise<void>;
//# sourceMappingURL=mail.d.ts.map