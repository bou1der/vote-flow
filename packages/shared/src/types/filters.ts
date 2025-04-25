import { t } from "elysia";

export const FilterSchema = t.Optional(
	t.Partial(
		t.Object({
			ids: t.Array(t.String()),
			cursor: t.Number(),
			search: t.String(),
		}),
	),
);
