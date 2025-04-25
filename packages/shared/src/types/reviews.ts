import { t } from "elysia";
import { z } from "zod";

export const ReviewSchema = t.Object({
	description: t.String(),
	anonymous: t.Boolean({ default: false }),
});

export const ReviewFormSchema = z.object({
	description: z.string({ required_error: "Отзыв не заполнен" }).min(14, "Отзыв слишком короткий"),
	anonymous: z.boolean().default(false),
});
