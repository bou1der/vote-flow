import type { InferTreatyReturnType } from "shared/types/utils";
import type { api } from ".";

export type Session = InferTreatyReturnType<typeof api.user.index.get>;
