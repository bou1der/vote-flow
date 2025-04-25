import { and, asc, eq, exists, inArray, sql } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { answers, db, votes, votings } from "~/lib/db";
import { FilterSchema } from "shared/types/filters";
import { VotingSchema } from "shared/types/votings";
import { userService } from "./user";
import { api } from "..";
import { isAfter, isBefore } from "date-fns";

const VOTINGS_SQ = sql<string>`(SELECT (*) FROM ${votes} WHERE ${votes.votingId} = ${votings.id})`;
export const votingsRouter = new Elysia({ prefix: "/votings" })
	.use(userService)
	.get(
		"/",
		async ({ query, session }) => {
			const res = await db
				.select({
					id: votings.id,
					question: votings.question,
					imageId: votings.imageId,
					to: votings.to,
					from: votings.from,
					createdAt: votings.createdAt,
					// votes: VOTINGS_SQ,
				})
				.from(votings)
				.where(
					and(
						eq(votings.isDeleted, false),
						inArray(votings.id, query.filters!.ids!).if(query.filters?.ids),
						eq(votings.createdBy, session?.user.id || "").if(session && query.self),
					),
				)
				.orderBy(asc(votings.createdAt));

			return res;
		},
		{
			query: t.Object({
				filters: FilterSchema,
				self: t.Optional(t.Boolean()),
			}),
		},
	)
	.post(
		"/",
		async ({ body, session, headers, error }) => {
			const { data: imageId } = await api.file.index.post(
				{ file: body.image },
				{
					query: {
						isImage: true,
					},
					headers,
				},
			);
			if (!imageId) return error(500, "Ошибка загрузки изображения");

			return await db.transaction(async trx => {
				const res = (
					await trx
						.insert(votings)
						.values({
							...body,
							imageId,
							createdBy: session!.user.id,
						})
						.returning()
				)[0]!;
				await trx.insert(answers).values(
					body.answers.map(ans => ({
						description: ans,
						votingId: res.id,
					})),
				);
				return res;
			});
		},
		{
			isSignedIn: true,
			body: VotingSchema,
		},
	)
	.post(
		"/:id",
		async ({ params, body, session, error }) => {
			const res = (
				await db
					.select({
						id: votings.id,
						from: votings.from,
						to: votings.to,
						voted: exists(
							db
								.select()
								.from(votes)
								.where(and(eq(votes.votingId, votings.id), eq(votes.userId, session!.user.id)))
								.limit(1),
						),
					})
					.from(votings)
					.where(eq(votings.id, params.id))
					.limit(1)
			)[0];

			if (!res) {
				return error(404, "Голосование не найдено");
			}

			if (res.voted) {
				return error(409, "Вы уже голосовали");
			}

			if (isAfter(new Date(), res.to)) {
				return error(409, "Голосование уже закончилось");
			}
			if (isBefore(new Date(), res.from)) {
				return error(409, "Голосование еще не началось");
			}

			await db.insert(votes).values({
				userId: session!.user.id,
				votingId: res.id,
				answerId: body.answerId,
			});
		},
		{
			isSignedIn: true,
			body: t.Object({
				answerId: t.String(),
			}),
		},
	);
