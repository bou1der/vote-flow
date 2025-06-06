import { auth } from "~/lib/auth";

export async function CreateUser(email?: string) {
	const response = await auth.api.signUpEmail({
		body: {
			email: email ?? "test@example.com",
			password: "test1234",
			name: "Test User",
			//@ts-ignore
			role: "user",
		},
		asResponse: true,
	});
	const cookie = response.headers.get("set-cookie")!.split(";")[0]!;

	const user = await auth.api.signInEmail({
		body: { email: email ?? "test@example.com", password: "test1234" },
	});

	return {
		user: user.user,
		headers: {
			cookie,
		} as Record<string, string | undefined>,
	};
}
