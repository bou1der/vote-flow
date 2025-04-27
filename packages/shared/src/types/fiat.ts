import { t } from "elysia";
import { z } from "zod";

export const FiatPaymentFormSchema = z.object({
	amount: z.coerce
		.number({
			required_error: "Укажите сумму",
			invalid_type_error: "Сумма не является строкой",
		})
		.min(2, "Сумма не может быть меньше 2 ₽"),
	comment: z.string().max(255, "Комментарий слишком длинный").optional(),
});

export const FiatPaymentSchema = t.Object({
	amount: t.Number({
		minimum: 0,
	}),
	comment: t.Optional(t.String({ maxLength: 255 })),
});
