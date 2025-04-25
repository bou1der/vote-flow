import Link from "ui/components/link";
import Image from "ui/components/image";
import { Logo } from "ui/components/custom/logo";
import { Avatar, AvatarFallback, AvatarImage } from "ui/components/avatar";
import { api } from "~/lib/api";
import { headers } from "~/lib/server/headers";

export async function Footer() {
	const { data: session } = await api.user.index.get({
		headers: await headers(),
	});

	return (
		<div className="bg-primary w-full">
			<div className="container flex flex-col gap-6 py-12">
				<div className="flex justify-between border-b border-white/15 py-7">
					<Logo />
					<div>
						<Link variant="link" className="text-foreground/80 text-[16px]" href="/">
							Главная
						</Link>
						<Link variant="link" className="text-foreground/80 text-[16px]" href="/votings">
							Голосования
						</Link>
						<Link variant="link" className="text-foreground/80 text-[16px]" href="/about">
							О проекте
						</Link>
					</div>
				</div>

				<div className="flex justify-between items-baseline pb-6">
					<p className="text-white/60">2024. Все права защищены</p>
					{session?.user ? (
						<Link href={"/dashboard"} variant={"ghost"} className="rounded-3xl text-lg p-4 gap-4 min-w-32">
							<Avatar className="size-8">
								<AvatarImage asChild src={`/api/file/${session.user.image || "null"}`}>
									<Image src={session.user.image || ""} width={600} height={600} alt="lol" />
								</AvatarImage>
								<AvatarFallback className="text-black ">
									{session.user.name?.[0] || session.user.email[0]}
								</AvatarFallback>
							</Avatar>
							{session.user.name || session.user.email}
						</Link>
					) : (
						<Link variant="secondary" className="px-12 rounded-3xl" href="/auth/signin">
							Войти
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
