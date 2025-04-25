"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem } from "ui/components/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "ui/components/sheet";
import { Textarea } from "ui/components/textarea";
import { ReviewFormSchema } from "shared/types/reviews";
import { Switch } from "ui/components/switch";
import { OnError } from "~/lib/client/on_error";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { TreatyError } from "shared/types/utils";
import { Button } from "ui/components/button";

export function CreateReviewForm() {
	const [open, setOpen] = useState(false);
	const schema = ReviewFormSchema;

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			description: "",
			anonymous: false,
		},
	});

	const createMutation = useMutation({
		mutationKey: ["create", "review"],
		mutationFn: async (data: z.infer<typeof ReviewFormSchema>) => {
			const res = await api.reviews.index.post(data);
			if (res.error) throw new TreatyError(res.error);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Отзыв отправлен на рассмотрение");
			setOpen(false);
			form.reset();
		},
	});

	const onSubmit = (data: z.infer<typeof schema>) => {
		createMutation.mutate(data);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant={"secondary"}>Оставить отзыв</Button>
			</SheetTrigger>
			<SheetContent className="space-y-5 flex flex-col justify-stretch">
				<SheetHeader>
					<SheetTitle>Оставить отзыв</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, OnError)} className="flex flex-col justify-between grow">
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormDescription className="opacity-100 text-white text-lg">Отзыв</FormDescription>
										<FormControl>
											<Textarea {...field} className="bg-input max-h-96" placeholder="Я люблю голосовать за путина" />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="anonymous"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between">
										<FormDescription className="opacity-100 text-white text-lg">Анонимный отзыв</FormDescription>
										<FormControl>
											<Switch onCheckedChange={field.onChange} checked={field.value} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button disabled={createMutation.isPending}>Отправить</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
