import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { fileRouter } from "./routers/file";
import { userRouter } from "./routers/user";
import { reviewRouter } from "./routers/review";
import { votingRouter } from "./routers/voting";
import { cryptoPayments } from "./routers/crypto";


export const appRouter = createTRPCRouter({
  file: fileRouter,
  user: userRouter,
  review: reviewRouter,
  voting: votingRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
