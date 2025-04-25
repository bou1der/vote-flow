import { redirect } from "next/navigation";
import type React from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { authClient } from "~/lib/client/auth-client";
import { headers } from "next/headers";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (!session?.user) {
		redirect("/auth/signin");
	}

	return (
		<div className="w-dvw h-dvh flex gap-6">
			<Sidebar />
			<div className="grow pb-4 max-h-screen overflow-y-scroll no-scrollbar px-6">
				<div className="size-full flex flex-col justify-stretch ">
					<DashboardHeader />
					{children}
				</div>
			</div>
		</div>
	);
}
