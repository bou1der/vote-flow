import { z } from "zod";
import { description } from "./utils";
import { statusEnum } from "~/server/db/schema";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";



export const StatusReviewEnum = z.enum(statusEnum.enumValues).default("WAITING")
export const ReviewSchema = z.object({
  status:StatusReviewEnum,
  description,
  anonymous:z.boolean().optional().default(false),
})


export type Review = inferRouterOutputs<AppRouter>["review"]["getAll"][number]
