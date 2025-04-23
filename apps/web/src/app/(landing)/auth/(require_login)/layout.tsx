import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "~/lib/client/auth-client";

export default async function RequireLoginRedirect({
	children,
}: {
	children: ReactNode;
}) {
	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (session?.user) redirect("/");

	return children;
}
