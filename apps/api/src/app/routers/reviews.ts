import Elysia, { t } from "elysia";
import { userService } from "./user";
import { FilterSchema } from "shared/types/filters";
import { db, reviews, user } from "~/lib/db";
import { and, eq } from "drizzle-orm";
import { ReviewSchema } from "shared/types/reviews";

export const reviewsRouter = new Elysia({ prefix: "/reviews" })
	.use(userService)
	.get(
		"/",
		async ({ session }) => {
			const res = await db
				.select({
					id: reviews.id,
					description: reviews.description,
					status: reviews.status,
					user: {
						id: user.id,
						imageId: user.image,
						name: user.name,
					},
				})
				.from(reviews)
				.where(and(eq(reviews.status, "ACCEPTED").if(session?.user.role !== "admin"), eq(reviews.isDeleted, false)))
				.leftJoin(user, eq(user.id, reviews.userId));
			return res;
		},
		{
			query: t.Object({
				filters: FilterSchema,
			}),
		},
	)
	.post("/", async () => {}, {
		isSignedIn: true,
		body: ReviewSchema,
	});
