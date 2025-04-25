"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Session } from "api/types";
import type { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem } from "ui/components/form";
import { OnError } from "~/lib/client/on_error";
import { useMutation } from "@tanstack/react-query";
import { Button } from "ui/components/button";
import { UserFormSchema } from "shared/types/user";
import { api } from "~/lib/api";
import { TreatyError } from "shared/types/utils";
import { ImageInput, Input } from "ui/components/input";

export function UpdateForm({
	session,
}: {
	session: Session;
}) {
	const form = useForm({
		resolver: zodResolver(UserFormSchema),
		defaultValues: session.user as unknown as z.infer<typeof UserFormSchema>,
	});

	const updateMutation = useMutation({
		mutationKey: ["update", "user", "self"],
		mutationFn: async (data: z.infer<typeof UserFormSchema>) => {
			const res = await api.user.index.patch(data);
			if (res.error) throw new TreatyError(res.error);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Профиль успешно обновлен");
		},
	});

	const onSubmit = (data: z.infer<typeof UserFormSchema>) => {
		updateMutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, OnError)} className="space-y-6 max-w-96">
				<p className="opacity-100 font-bold">Личная информация</p>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => {
						return (
							<FormItem>
								<FormDescription className=" text-lg text-white opacity-100">Фото</FormDescription>
								<FormControl>
									<ImageInput {...field} accept="image/*" />
								</FormControl>
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormDescription className=" text-lg text-white opacity-100">Ник</FormDescription>
							<FormControl>
								<Input placeholder="Никнейм" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Input disabled placeholder="Почта" value={session.user.email} />

				<Button className="w-full rounded-lg" disabled={updateMutation.isPending}>
					Сохранить
				</Button>
			</form>
		</Form>
	);
}
