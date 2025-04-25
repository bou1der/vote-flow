import { treaty } from "@elysiajs/eden";
import type { App } from "api";
import { env } from "utils/env";

export const api = treaty<App>(`${env.NEXT_PUBLIC_PROTOCOL}://api.${env.NEXT_PUBLIC_DOMAIN}`, {
	fetch: {
		credentials: "include",
	},
}).api;
