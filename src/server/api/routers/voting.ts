import { IdSchema } from "~/lib/shared/types/utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { VotingSchema } from "~/lib/shared/types/votings";
import { createCaller } from "../root";
import { answers, votings } from "~/server/db/schema";

export const votingRouter = createTRPCRouter({
  create: protectedProcedure
  .input(VotingSchema)
  .mutation(async ({ctx, input}) => {

    const caller = createCaller(ctx)
    const imageId = (await caller.file.create(input.image)).id 

    const voting = (await ctx.db.insert(votings)
      .values({
        ...input,
        ...input.dates,
        imageId,
        createdBy:ctx.session.user.id,
      })
      .returning())[0]!

    await ctx.db.insert(answers)
      .values(
        input.answers.map((ans) => ({
          description:ans,
          votingId:voting.id,
        })
      ))

    // await Promise.all(input.answers.map((ans) => {
    //   return ctx.db.insert(answers)
    //     .values()
    // }))
  }),
  // getAll:publicProcedure
  // .query(async ({ctx}) => {
  //   // const t = ctx.db.query.
  // }),
  getSelf:protectedProcedure
  .query(async ({ctx}) => {
    return await ctx.db.query.votings.findMany({
      where:(tb, {eq}) => eq(tb.createdBy, ctx.session.user.id),
      with:{
        answers:true
      }
    })
  }),
  getOne: publicProcedure
  .input(IdSchema)
  .query(async ({ctx, input}) => {
    const voting = await ctx.db.query.votings.findFirst({
      where:(tb, {eq}) => eq(tb.id, input.id),
      with:{
        answers:{
          with:{
            votes:true
          }
        }
      }
    })
  }),

})
