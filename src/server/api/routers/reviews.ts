import { ReviewSchema } from "~/lib/shared/types/review";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { IdSchema } from "~/lib/shared/types/utils";
import { and, eq } from "drizzle-orm";
import { reviews, users } from "~/server/db/schema";



export const reviewRouter = createTRPCRouter({
  create:protectedProcedure
  .input(ReviewSchema)
  .mutation(async ({ctx, input}) => {
    await ctx.db.insert(reviews)
      .values({
        ...input,
        status:"WAITING",
        userId:ctx.session.user.id
      })
  }),
  update:adminProcedure
  .input(ReviewSchema.merge(IdSchema))
  .mutation(async ({ctx, input}) => {
    await ctx.db.update(reviews)
      .set({...input})
      .where(eq(reviews.id, input.id))
  }),
  getAll:publicProcedure
  .query(async ({ctx}) => {
    return await ctx.db.select({
      id:reviews.id,
      description:reviews.description,
      user:{
        id:users.id,
        imageId:users.image,
        name:users.name,
      }
    })
    .from(reviews)
    .where(and(
      eq(reviews.status, "ACCEPTED").if(ctx.session?.user.role !== "ADMIN"),
      eq(reviews.isDeleted, false),
    ))
    .leftJoin(users, and(
      eq(reviews.anonymous, false).if(ctx.session?.user.role !== "ADMIN"),
      eq(reviews.userId, users.id),
    ))
  }),
  delete: adminProcedure
  .input(IdSchema)
  .mutation(async ({ctx, input}) => {
    await ctx.db.update(reviews)
      .set({isDeleted:true})
      .where(eq(reviews.id, input.id))
  })
})

