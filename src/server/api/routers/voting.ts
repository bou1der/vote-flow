import { IdSchema } from "~/lib/shared/types/utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { VotingSchema, VotingsFilters } from "~/lib/shared/types/votings";
import { createCaller } from "../root";
import { answers, votes, votings } from "~/server/db/schema";
import { and, count, desc, eq, InferSelectModel, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isAfter, isBefore } from "date-fns";

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
  }),
  getAll:publicProcedure
  .input(VotingsFilters)
  .query(async ({ctx, input}) => {

    const sq = sql<number>`(${
       ctx.db.select({
        count:count(votes.userId)
      })
      .from(votes)
      .where(eq(votes.votingId, votings.id)) 
    })`

    return await ctx.db.select({
      id:votings.id,
      question:votings.question,
      imageId:votings.imageId,
      to:votings.to,
      from:votings.from,
      createdAt:votings.createdAt,
      votes:sq
    })
    .from(votings)
    .where(and(
      eq(votings.isDeleted, false),
      eq(votings.createdBy, ctx.session!.user.id).if(input?.self && ctx.session)
    ))
    .orderBy(desc(votings.createdAt))
  }),
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
    const query = await ctx.db.query.votings.findFirst({
      where:(tb, {eq}) => eq(tb.id, input.id),
      with:{
        answers:{
          with:{
            votes:true
          }
        }
      }
    })

    if(!query){
      throw new TRPCError({
        code:"NOT_FOUND",
        message:"Голосование не найдено"
      })
    }

    return {
      ...query,
      answers: query.answers.map((ans) => {
          const vote = ans.votes.find((v) => v.userId === ctx.session?.user.id)

          return {
            ...ans,
            votes:ans.votes.length,
            isVote: vote ? true : false
          }
        })
    }
  }),
  vote: protectedProcedure
  .input(IdSchema.merge(
    z.object({
      answerId:z.string({
        required_error:"Укажите ответ",
        message:"Ответ не указан"
      })
    })
  ))
  .mutation(async ({ctx, input}) => {
    const query = (await ctx.db.select()
      .from(votings)
      .where(eq(votings.id, input.id))
      .leftJoin(votes, and(
        eq(votes.userId, ctx.session.user.id),
        eq(votes.votingId, input.id),
      ))
      .limit(1))[0]
    
    if(!query || !query.votings){
      throw new TRPCError({
        code:"NOT_FOUND",
        message:"Голосование не найдено"
      })
    }

    if(query.votes){
      throw new TRPCError({
        code:"CONFLICT",
        message:"Вы уже голосовали"
      })
    }

    if(isAfter(new Date(), query.votings.to)){
      throw new TRPCError({
        code:"CONFLICT",
        message:"Голосование уже закончилось"
      })
    } else if(isBefore(new Date(), query.votings.from)){
      throw new TRPCError({
        code:"CONFLICT",
        message:"Голосование еще не началось"
      })
    }


    await ctx.db.insert(votes)
      .values({
        userId:ctx.session.user.id,
        votingId:input.id,
        answerId:input.answerId
      })
  })
})
