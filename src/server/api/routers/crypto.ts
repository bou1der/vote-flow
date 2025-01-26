import { z } from "zod";
import { Wallet } from "@tonconnect/sdk"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { wallets } from "~/server/db/schema";



export const cryptoPayments = createTRPCRouter({
  create: publicProcedure
  .mutation(async ({ctx}) => {
  }),
  connect: protectedProcedure
  .input(
    z.object({
      wallet:z.string(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const wallet:Wallet = JSON.parse(input.wallet);

    if(!wallet || typeof wallet.account.address !== "string"){
      throw new TRPCError({
        code:"CONFLICT",
        message:"Какая то хуйня брат"
      })
    }

    await ctx.db.insert(wallets)
      .values({
        userId:ctx.session.user.id,
        wallet: input.wallet
      })
  }),
  // getWallet:protectedProcedure
  // .query(async ({ctx}) => {
  //
  //   return ctx.db.select()
  //     .from()
  //
  // })
})
