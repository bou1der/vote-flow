"use client";

import { BadgeInfo } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Review } from "api/types";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Image from "~/components/ui/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function UpdateReviewForm({
	review,
}: {
	review: Review;
}) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const updateMutation = useMutation({
		mutationKey: ["update", "review", reviews.id],
		mutationFn: async () => {
			const res = await api.reviews.index.put;
		},
	});
	const ReviewUpdateMutation = api.review.update.useMutation({
		onSuccess: () => {
			router.refresh();
			toast.success("Решение сохранено");
			setOpen(false);
		},
		onError: err => {
			toast.error("Ошибка сохранения", {
				description: err.message,
			});
		},
	});

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button size="icon">
					<BadgeInfo />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col">
				<SheetHeader className="flex flex-row items-center gap-2">
					<Avatar>
						<AvatarImage asChild src={`/api/file/${review.user?.imageId}`}>
							<Image src={`${review.user?.imageId}`} height={600} width={600} alt={review.user?.name || ""} />
						</AvatarImage>
						<AvatarFallback>{review.user?.name?.[0]}</AvatarFallback>
					</Avatar>
					<SheetTitle className="text-xl">{review.user.name}</SheetTitle>
				</SheetHeader>
				<p className="grow">{review.description}</p>
				<div className="flex items-stretch gap-2">
					<Button
						onClick={() => ReviewUpdateMutation.mutate({ ...review, status: "CANCELED" })}
						variant={"destructive"}
						className="basis-1/2"
						disabled={ReviewUpdateMutation.isPending}
					>
						{review.status === "ACCEPTED" ? "Скрыть" : "Отклонить"}
					</Button>

					<Button
						onClick={() => ReviewUpdateMutation.mutate({ ...review, status: "ACCEPTED" })}
						className="bg-green-400 basis-1/2 hover:bg-green-100"
						disabled={ReviewUpdateMutation.isPending}
					>
						Принять
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
