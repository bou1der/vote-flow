import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { authClient } from "~/lib/client/auth-client";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (session?.user.role !== "admin") {
		redirect("/auth/signin");
	}

	return children;
}
