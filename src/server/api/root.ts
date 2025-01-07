import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { fileRouter } from "./routers/file";
import { userRouter } from "./routers/user";
import { reviewRouter } from "./routers/reviews";


export const appRouter = createTRPCRouter({
  file: fileRouter,
  user: userRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
