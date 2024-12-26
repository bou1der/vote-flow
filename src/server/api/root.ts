import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { fileRouter } from "./routers/file";
import { userRouter } from "./routers/user";


export const appRouter = createTRPCRouter({
  file: fileRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
