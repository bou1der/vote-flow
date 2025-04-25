import { ChartNoAxesCombined, HeartHandshake, Smartphone, SquareMousePointer, SwatchBook } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/client/utils";
import { Gradient } from "ui/components/icons/gradient";

export function Our() {
	return (
		<div className="container relative space-y-16 py-14 sm:py-20">
			<Gradient className="absolute translate-x-[400px] right-0 translate-y-52 opacity-70" />
			<div className="w-full space-y-4">
				<h1 className="text-center font-bold">Наши преимущества</h1>
				<p className="text-center max-w-[400px] mx-auto">Удобный, честный и быстрый сервис голосования.</p>
			</div>
			<div className="min-h-[542px] gap-8 grid grid-cols-3 grid-rows-3">
				<CardContainer className="row-start-1 row-end-4">
					<Smartphone className="size-12" />
					<h4>Легкая доступность</h4>
					<p>Голосуйте в пару кликов с любого устройства.</p>
				</CardContainer>

				<CardContainer className="row-start-1 row-end-3">
					<HeartHandshake className="size-12" />
					<h4>Честные выборы</h4>
					<p>Прозрачность системы исключает фальсификации.</p>
				</CardContainer>

				<CardContainer className="row-start-3 row-end-4">
					<SwatchBook className="size-12" />
					<h4>Темы от пользователей</h4>
					<p>Обсуждайте и голосуйте за то, что важно именно вам.</p>
				</CardContainer>

				<CardContainer className="row-start-1 row-end-2">
					<ChartNoAxesCombined className="size-12" />
					<h4>Аналитика результатов</h4>
					<p>Голосуйте в пару кликов с любого устройства.</p>
				</CardContainer>

				<CardContainer className="row-start-2 row-end-4">
					<SquareMousePointer className="size-12" />
					<h4>Приятный интерфейс</h4>
					<p>Удобный просмотр и анализ итогов.</p>
				</CardContainer>
			</div>
		</div>
	);
}

function CardContainer({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={cn(
				className,
				"bg-primary gap-2 rounded-3xl border border-gray-500/50 p-6 flex flex-col justify-end  items-start",
			)}
		>
			{children}
		</div>
	);
}
