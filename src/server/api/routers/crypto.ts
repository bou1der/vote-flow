import { createTRPCRouter, publicProcedure } from "../trpc";



export const cryptoPayments = createTRPCRouter({
  create: publicProcedure
  .mutation(async ({ctx}) => {

  }),
})
