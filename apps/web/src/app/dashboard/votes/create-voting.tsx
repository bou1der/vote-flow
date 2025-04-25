"use client";
"use no memo";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Calendar } from "ui/components/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "ui/components/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem } from "ui/components/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "ui/components/sheet";
import Editor from "ui/components/editor";
import { OnError } from "~/lib/client/on_error";
import { VotingFormSchema } from "shared/types/votings";
import { Input, ImageInput } from "ui/components/input";
import { api } from "~/lib/api";
import { useMutation } from "@tanstack/react-query";
import { TreatyError } from "shared/types/utils";
import { Button } from "ui/components/button";

export function CreateVotingForm() {
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(VotingFormSchema),
		defaultValues: {} as unknown as z.infer<typeof VotingFormSchema>,
	});

	const createMutation = useMutation({
		mutationKey: ["create", "voting"],
		mutationFn: async (data: z.infer<typeof VotingFormSchema>) => {
			const res = await api.votings.index.post(data);
			if (res.error) throw new TreatyError(res.error);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Голосование успешно создано");
			form.reset();
		},
	});

	const ansRefs = useRef<HTMLInputElement[]>([]);

	const answers = useFieldArray({
		name: "answers" as never,
		control: form.control,
	});

	useEffect(() => {
		if (answers.fields.length === 0) answers.append("");
	}, [answers.fields]);

	const onSubmit = (data: z.infer<typeof VotingFormSchema>) => {
		createMutation.mutate(data);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild className="order-first cursor-pointer min-h-[446px]">
				<div className="size-full flex flex-col items-center justify-center">
					<Plus className="size-16" />
					<p className="opacity-100 text-xl">Создать голосование</p>
				</div>
			</SheetTrigger>
			<SheetContent className="space-y-4 overflow-y-scroll no-scrollbar max-w-sm sm:max-w-2xl container">
				<SheetTitle>
					<SheetHeader>Создание голосования</SheetHeader>
				</SheetTitle>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, OnError)} className="space-y-6 ">
						<FormField
							name="image"
							control={form.control}
							render={({ field }) => (
								<FormItem className="w-full">
									<FormDescription>Обложка*</FormDescription>
									<FormControl>
										<ImageInput {...field} accept="image/*" />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							name="question"
							control={form.control}
							render={({ field }) => (
								<FormItem className="w-full">
									<FormDescription>Вопрос*</FormDescription>
									<FormControl>
										<Input placeholder="Почему ОН а не Я" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							name="dates"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormDescription>Дата проведения*</FormDescription>
									<FormControl>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button className="w-full" variant={"input"}>
													<p className="text-sm w-full text-left">
														{field.value?.from && field.value?.to
															? `С ${format(field.value.from as Date, "dd.MM.yyyy")} по ${format(field.value.to as Date, "dd.MM.yyyy")}`
															: "Выберите дату"}
													</p>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="bg-background border-input">
												<Calendar mode="range" fromDate={new Date()} selected={field.value} onSelect={field.onChange} />
											</DropdownMenuContent>
										</DropdownMenu>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem className="w-full">
									<FormDescription>Описание*</FormDescription>
									<FormControl>
										<Editor setText={field.onChange} options={{ quotes: true }} text={field.value} />
									</FormControl>
								</FormItem>
							)}
						/>

						{answers.fields.map((_, index) => (
							<FormField
								key={`${index + 1}`}
								control={form.control}
								name={`answers.${index}`}
								render={({ field }) => (
									<FormItem>
										<FormDescription>Ответ {index + 1}*</FormDescription>
										<FormControl>
											<Input
												ref={el => {
													if (el) ansRefs.current[index] = el;
												}}
												onKeyUp={() => {
													const last = ansRefs.current[ansRefs.current.length - 1];
													if (last) last.focus();
												}}
												onChange={e => {
													if (e.target.value === "") {
														answers.remove(index);
													} else {
														field.onChange(e.target.value);
													}
												}}
												value={field.value}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						))}
						{answers.fields.length < 5 ? (
							<Button className="w-full" variant={"input"} type="button" onClick={() => answers.append("")}>
								<p className="flex items-center gap-2 w-full  text-sm">
									<Plus className="size-4" />
									Добавить ответ
								</p>
							</Button>
						) : null}

						<Button disabled={createMutation.isPending}>Сохранить</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
