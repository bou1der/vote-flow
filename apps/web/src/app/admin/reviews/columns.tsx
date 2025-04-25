"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "ui/components/avatar";
import { UpdateReviewForm } from "./update-review";
import { Check, Clock, X } from "lucide-react";
import Image from "ui/components/image";
import type { Review } from "api/types";

export const columns: ColumnDef<Review>[] = [
	{
		accessorKey: "user",
		header: "Пользователь",
		cell: ({ row }) => {
			const origin = row.original;
			if (!origin.user) return "Анонимный";
			return (
				<div className="flex items-center gap-2 justify-stretch">
					<Avatar>
						<AvatarImage asChild src={`/api/file/${origin.user.imageId}`}>
							<Image src={`${origin.user.imageId}`} height={600} width={600} alt={origin.id} />
						</AvatarImage>
						<AvatarFallback>{origin.user.name?.[0]}</AvatarFallback>
					</Avatar>
					<p>{origin.user.name}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Описание",
		cell: ({ row }) => {
			const origin = row.original;
			if (origin.description.length > 60) return origin.description.slice(0, 60) + "...";
			return origin.description;
		},
	},
	{
		accessorKey: "status",
		header: "Статус",
		cell: ({ row }) => {
			const origin = row.original;
			const className = "flex items-center gap-2";

			switch (origin.status) {
				case "WAITING":
					return (
						<div className={className}>
							<Clock />
							Ожидание
						</div>
					);
				case "ACCEPTED":
					return (
						<div className={className}>
							<Check />
							Принят
						</div>
					);
				case "CANCELED":
					return (
						<div className={className}>
							<X />
							Отклонен
						</div>
					);
				default:
					return "Неизвестен";
			}
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => <UpdateReviewForm review={row.original} />,
	},
];
