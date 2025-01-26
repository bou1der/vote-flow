import { createTRPCRouter, publicProcedure } from "../trpc";
import { YooPaymentSchema } from "~/lib/shared/types/donations";
import { donations, users, votings } from "~/server/db/schema";
import { and, eq, isNotNull, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { IdSchema } from "~/lib/shared/types/utils";
import { env } from "~/env";



export const yookassaRouter = createTRPCRouter({
  payment: publicProcedure
  .input(YooPaymentSchema)
  .mutation(async ({ctx, input}) => {
    const res = (await ctx.db.select()
      .from(votings)
      .where(eq(votings.id, input.votingId))
      .leftJoin(users, eq(users.id, votings.createdBy))
      .limit(1))[0]

    if(!res || res.user === null || !res.votings){
      throw new TRPCError({
        code:"NOT_FOUND",
        message:"Пользователь не найден"
      })
    }

    const idempotencyKey = crypto.randomUUID()
    try {
      const pay = await ctx.yookassa.createPayment({
        amount: {
            value: `${input.amount}`,
            currency: 'RUB'
        },
        payment_method_data: {
            type: 'bank_card'
        },
        confirmation: {
            return_url: `${env.NEXT_PUBLIC_URL}/payment?id=${idempotencyKey}`,
            type: 'redirect',
        }
      },
        idempotencyKey
      )

      await ctx.db.insert(donations)
        .values({
          ...input,
          transactionId:pay.id,
          idempotencyKey,
          type:"FIAT",
          status:"PENDING",
          votingId: res.votings.id,
          recipientId:res.user.id,
          senderId: ctx.session?.user.id,
        })

      return pay.confirmation.confirmation_url
    } catch(err){
      console.error(err)
      throw new TRPCError({
        code:"INTERNAL_SERVER_ERROR",
        message: "Внутренняя ошибка сервера"
      })
    }
  }),

  checkPayment:publicProcedure
  .input(IdSchema)
  .query(async ({ctx, input}) => {
    const [payment] = await ctx.db.select()
      .from(donations)
      .where(and(
        eq(donations.idempotencyKey, input.id),
        eq(donations.type, "FIAT"),
        or(
          eq(donations.status, "PENDING"),
          eq(donations.status, "COMPLITED"),
        ),
        isNotNull(donations.transactionId),
        isNotNull(donations.idempotencyKey),
      ))
      .limit(1)

    if(!payment){
      throw new TRPCError({
        code:"NOT_FOUND",
        message:"Платеж не найден"
      })
    }

    const paymentInfo = await ctx.yookassa.getPayment(payment.transactionId!)


    // ctx.yookassa.createWebHook
    // const hook = await ctx.yookassa.createWebHook({
    //   event:"payment.waiting_for_capture",
    // },
    //   payment.idempotencyKey
    // )

  })
})
