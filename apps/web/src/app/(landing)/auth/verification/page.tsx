"use client";

import { useMutation } from "@tanstack/react-query";
import { notFound, usePathname, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/client/auth-client";
import Loader from "ui/components/loader";

export default function VerificationPage({
	searchParams,
}: {
	searchParams: Promise<{
		token: string | undefined;
		success: string | undefined;
	}>;
}) {
	const { token, success } = use(searchParams);
	const pathname = usePathname();
	const router = useRouter();

	if (success === "true") {
		return <h1>Успешно</h1>;
	}

	if (success === "false") {
		return <h1>Ошибка авторизации</h1>;
	}

	if (!token) return notFound();

	const { isPending, mutate } = useMutation({
		async mutationFn() {
			return (
				await authClient.verifyEmail({
					query: {
						token,
					},
				})
			).data;
		},
		onError(err) {
			toast.error("Ошибка верификации", {
				description: err.message,
			});
			const newSearchParams = new URLSearchParams();
			newSearchParams.append("success", "false");
			router.push(`${pathname}?${newSearchParams.toString()}`);
		},
		onSuccess() {
			const newSearchParams = new URLSearchParams();
			newSearchParams.append("success", "true");
			router.push(`${pathname}?${newSearchParams.toString()}`);
		},
	});

	if (isPending) {
		return <Loader />;
	}

	useEffect(() => {
		mutate();
	}, []);

	return;
}
