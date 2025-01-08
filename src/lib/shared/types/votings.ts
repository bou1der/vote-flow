import { z } from "zod";
import { FileSchema } from "./file";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { isBefore, isToday, startOfDay } from "date-fns";


export const VotingSchema = z.object({
  image: FileSchema,
  question: z.string({
    required_error:"Вопрос не заполнен",
    message:"Вопрос не заполнен",
  })
  .min(6, "Вопрос слишком короткий")
  .max(255, "Вопрос слишком длинный"),
  description: z.string({
    required_error:"Описание не заполнено",
    message:"Описание не заполнено",
  })
  .min(40, "Описание слишком короткое"),

  dates:z.object({
    from: z.date({
      required_error:"Дата начала не указана",
      message:"Дата начала не указана"
    }),
    to: z.date({
      required_error:"Дата окончания не заполнена",
      message:"Дата окончания не заполнена",
    })
  }).superRefine((args, ctx) => {
    if(isBefore(startOfDay(args.from), startOfDay(new Date()))){
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:"Дата начала не должна быть раньше сегодняшней 1"
      })
    } else if(!isToday(args.from) && isBefore(args.from, new Date()) ) return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:"Дата начала не должна быть раньше сегодняшней"
      })
    if( isToday(args.to) || isBefore(args.to, new Date())) return ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:"Дата окончания не должна быть сегодняшей или прошедшей"
    })
  }),
  answers: z.string({})
    .array()
    .min(2)
    .max(5)
})


export type SelfVoting = inferRouterOutputs<AppRouter>["voting"]["getSelf"][number]
