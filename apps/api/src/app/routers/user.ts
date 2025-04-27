import Elysia, { error, t } from "elysia";
import { UserSchema, type UserRole } from "shared/types/user";
import { auth } from "~/lib/auth";
import { db, user } from "~/lib/db";
import { api } from "..";
import { eq } from "drizzle-orm";

export const userService = new Elysia({ name: "user/service" })
	.derive({ as: "global" }, async ({ request: { headers } }) => ({
		session: await auth.api.getSession({ headers }),
	}))
	.macro({
		hasRole: (role?: UserRole) => {
			if (!role) return;
			return {
				beforeHandle({ session }) {
					if (session?.user?.role !== role)
						return error(401, {
							message: "Для выполнения этого действия необходимо быть администратором",
						});
				},
			};
		},
		isSignedIn: (enabled?: boolean) => {
			if (!enabled) return;
			return {
				beforeHandle({ session }) {
					if (!session?.user)
						return error(401, {
							message: "Для выполнения этого действия необходимо авторизоваться",
						});
				},
			};
		},
	});

export const userRouter = new Elysia({ prefix: "/user" })
	.use(userService)
	.get("/", ({ session }) => session)
	.patch(
		"/",
		async ({ body, session, headers }) => {
			let imageId: string | undefined = undefined;
			if (body.image) {
				({ data: (imageId as unknown as string | null) } = await api.file.index.post(
					{ file: body.image },
					{
						query: {
							isImage: true,
						},
						headers,
					},
				));
			}
			await db
				.update(user)
				.set({
					...body,
					image: imageId,
				})
				.where(eq(user.id, session!.user.id));
		},
		{
			isSignedIn: true,
			body: t.Partial(UserSchema),
		},
	);
