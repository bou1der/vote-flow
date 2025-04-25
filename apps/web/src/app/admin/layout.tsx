import { notFound } from "next/navigation";
import type React from "react";
import { Sidebar } from "./sidebar";
import { AdminHeader } from "./header";
import type { ReactNode } from "react";
import { authClient } from "~/lib/client/auth-client";
import { headers } from "next/headers";

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (session?.user.role !== "ADMIN") {
		notFound();
	}

	return (
		<div className="w-dvw h-dvh flex gap-6">
			<Sidebar />
			<div className="grow max-h-screen overflow-y-scroll no-scrollbar px-6">
				<AdminHeader />
				{children}
			</div>
		</div>
	);
}
