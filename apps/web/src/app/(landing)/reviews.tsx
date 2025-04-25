"use client";

import Image from "ui/components/image";
import { Carousel, CarouselContent, CarouselItem } from "ui/components/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "ui/components/avatar";
import { notFound } from "next/navigation";
import { api } from "~/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { handleTreatyError } from "~/lib/client/query-client";
import { TreatyError } from "shared/types/utils";

export function Reviews() {
	const { data: reviews } = useSuspenseQuery({
		queryKey: ["get", "all", "reviews"],
		queryFn: async () => {
			const res = await api.reviews.index.get({
				query: {},
			});
			if (res.error) throw handleTreatyError(new TreatyError(res.error));
			return res.data;
		},
	});

	if (!reviews) return notFound();

	return (
		<div className="space-y-16 py-16 sm:py-20">
			<div className="space-y-4">
				<h1 className="font-bold text-center">Отзывы пользователей</h1>
				<p className="text-center">Нас выбирают за честность и удобство</p>
			</div>
			<Carousel
				opts={{
					startIndex: 2,
					loop: true,
				}}
			>
				<CarouselContent>
					{reviews.map(item => (
						<CarouselItem className="sm:basis-1/2 mr-8 p-6 bg-primary rounded-3xl space-y-3" key={item.id}>
							<div className="w-full flex items-center gap-5">
								<Avatar className="size-16">
									<AvatarImage asChild src={`/api/file/${item.user?.imageId}`} alt={item.user?.name || "Аноним"}>
										<Image width={600} height={600} src={`${item.user?.imageId}`} alt={item.user?.name || "Аноним"} />
									</AvatarImage>
									<AvatarFallback className="text-background">{item.user?.name?.split("")[0]}</AvatarFallback>
								</Avatar>
								<div>
									<span className="text-white font-medium text-xl select-none">{item.user?.name || "Аноним"}</span>
									{
										// <p className="select-none">{item.voites} голосов</p>
									}
								</div>
							</div>
							<span className="text-xl select-none">{item.description}</span>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
