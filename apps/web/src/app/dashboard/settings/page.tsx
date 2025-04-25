import { authClient } from "~/lib/client/auth-client";
import { UpdateForm } from "./update";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function SettingsDashboard() {
	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (!session) redirect("/auth/signin");

	return <UpdateForm session={session} />;
}
