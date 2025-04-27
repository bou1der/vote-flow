import { t } from "elysia";
import { z } from "zod";
import { isBefore, isToday, startOfDay } from "date-fns";

export const VotingSchema = t.Object({
	image: t.File(),
	question: t.String(),
	description: t.String(),
	from: t.Date(),
	to: t.Date(),
	answers: t.Array(t.String()),
});

export const VotingFormSchema = z.object({
	image: z.instanceof(File),
	question: z.string({
		required_error: "Вопрос голосования не указан",
	}),
	description: z.string({ required_error: "Описание не указано" }),
	dates: z
		.object({
			from: z.date({ required_error: "Дата начала не указана" }),
			to: z.date({ required_error: "Дата окончания не указана" }),
		})
		.superRefine((args, ctx) => {
			if (isBefore(startOfDay(args.from), startOfDay(new Date()))) {
				return ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Дата начала не должна быть раньше сегодняшней 1",
				});
			}
			if (!isToday(args.from) && isBefore(args.from, new Date()))
				return ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Дата начала не должна быть раньше сегодняшней",
				});
			if (isToday(args.to) || isBefore(args.to, new Date()))
				return ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Дата окончания не должна быть сегодняшей или прошедшей",
				});
		}),
	answers: z.string().array().min(2).max(5),
});
