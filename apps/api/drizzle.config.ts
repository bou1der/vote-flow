import type { Config } from "drizzle-kit";

export default {
	schema: "./src/lib/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
	out: "./drizzle",
	tablesFilter: ["project_*"],
} satisfies Config;
