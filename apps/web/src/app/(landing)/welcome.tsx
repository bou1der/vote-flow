import { Gradient } from "ui/components/icons/gradient";
import Link from "ui/components/link";

export function Welcome() {
	return (
		<div className="h-dvh w-full relative flex items-center">
			<Gradient className="absolute -translate-x-96 translate-y-52 opacity-70" />
			<div className="max-w-[758px] z-10 w-full space-y-12 text-center mx-auto">
				<div className="flex flex-col items-center gap-12">
					<h1 className="text-center font-bold">Создавайте темы и голосуйте за лучшее!</h1>
					<p className="text-center max-w-[638px]">
						Создавайте темы, выбирайте лучшие идеи и участвуйте в честных голосованиях. Ваш голос имеет значение!
					</p>
				</div>
				<Link href="/votings" className="rounded-3xl sm:w-fit w-full text-lg px-10">
					Перейти к голосованию
				</Link>
			</div>
		</div>
	);
}
