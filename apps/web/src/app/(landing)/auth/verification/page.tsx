"use client";

import { useMutation } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/client/auth-client";
import { Button } from "ui/components/button";

export default function VerificationPage({
	searchParams,
}: {
	searchParams: Promise<{
		token: string | undefined;
	}>;
}) {
	const { token } = use(searchParams);
	const [success, setSuccess] = useState<boolean | undefined>(undefined);

	if (!token) return notFound();

	const { isPending, mutate } = useMutation({
		mutationKey: ["verification"],
		mutationFn: async () => {
			const res = await authClient.verifyEmail({
				query: {
					token,
				},
			});
			if (res.error) throw res.error;
			return res.data;
		},
		onError: err => {
			toast.error("Ошибка верицикации");
			setSuccess(false);
		},
		onSuccess: () => {
			toast.success("Успешно");
			setSuccess(true);
		},
	});

	return (
		<div className="w-screen h-screen flex justify-between items-center">
			<Button loading={isPending} disabled={success !== undefined} onClick={() => mutate()}>
				{success === true ? "Успешно" : success === false ? "Ошибка" : "Подтвердить"}
			</Button>
		</div>
	);
}
