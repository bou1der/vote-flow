import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	},

	client: {
		NEXT_PUBLIC_DOMAIN: z.string(),
		NEXT_PUBLIC_PROTOCOL: z.string(),
	},

	runtimeEnv: {
		NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
		NEXT_PUBLIC_PROTOCOL: process.env.NEXT_PUBLIC_PROTOCOL,
		NODE_ENV: process.env.NODE_ENV,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
