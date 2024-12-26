import { updateUserSchema } from "~/lib/shared/types/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { createCaller } from "../root";

export const userRouter = createTRPCRouter({
  updateSelf:protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ctx, input}) => {
    let imageId:string | undefined = undefined;
    const caller = createCaller(ctx)

    if(input.image){
      ({ id: imageId } = await caller.file.create(input.image));
    }

    await ctx.db.update(users)
      .set({
        name:input.name,
        image:imageId
      })
  }),

})
