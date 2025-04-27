"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "~/lib/client/auth-client";
import { queryClient } from "~/lib/client/query-client";

export default function LogoutPage() {
	const router = useRouter();

	useEffect(() => {
		authClient.signOut({
			fetchOptions: {
				onSuccess() {
					queryClient.invalidateQueries({ queryKey: ["session"] });
					router.refresh();
					router.push("/");
				},
			},
		});
	}, [router]);

	return null;
}
