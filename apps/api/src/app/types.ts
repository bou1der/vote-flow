import type { InferTreatyReturnType } from "shared/types/utils";
import type { api } from ".";

export type Session = InferTreatyReturnType<typeof api.user.index.get>;
export type Voting = InferTreatyReturnType<typeof api.votings.index.get>[number];
export type Review = InferTreatyReturnType<typeof api.reviews.index.get>[number];
export type Answer = InferTreatyReturnType<ReturnType<typeof api.votings>["get"]>[number];
