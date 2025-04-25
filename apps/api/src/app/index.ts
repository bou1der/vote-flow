import cors from "@elysiajs/cors";
import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";
import { ApiErrorLogger } from "./middleware/logger";
import { betterAuthView, userRouter } from "./routers/user";
import { fileRouter } from "./routers/file";
import { logger } from "utils/logger";
import { votingsRouter } from "./routers/votings";
import { reviewsRouter } from "./routers/reviews";
export type { Auth } from "../lib/auth";

const app = new Elysia({ prefix: "/api" })
	.use(cors())
	.all("/auth/*", betterAuthView)
	.onTransform(data => {
		ApiErrorLogger(data);
		data.set.headers["content-type"] = "text/plain";
	})
	.onError(ApiErrorLogger)
	.use(userRouter)
	.use(fileRouter)
	.use(votingsRouter)
	.use(reviewsRouter)
	.listen(8000, () => {
		logger.info("Elysia is started on :8000 🦊");
	});

export const api = treaty(app).api;

export type App = typeof app;
