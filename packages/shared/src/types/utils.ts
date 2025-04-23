import type { Treaty } from "@elysiajs/eden";

// @ts-ignore
type TreatyFunction = (...args: any) => Promise<Treaty.TreatyResponse<unknown>>;

export type InferTreatyReturnType<T extends TreatyFunction> = NonNullable<Awaited<ReturnType<T>>["data"]>;

export type InferTreatyInputType<T extends TreatyFunction> = NonNullable<Parameters<T>[0]>;

export class TreatyError<T extends Record<number, unknown>> extends Error {
	constructor(
		public readonly error:
			| Treaty.TreatyResponse<T>["error"]
			| {
					status: unknown;
					value: unknown;
			  },
	) {
		super(JSON.stringify(error));
		this.name = "TreatyError";
		Object.setPrototypeOf(this, TreatyError.prototype);
	}
}
