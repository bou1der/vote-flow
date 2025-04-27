// import { headers } from "next/headers";
import { Logo } from "ui/components/custom/logo";
import Link from "ui/components/link";
import { api } from "~/lib/api";
import { headers } from "~/lib/server/headers";
// import { authClient } from "~/lib/client/auth-client";

export async function Navbar() {
	const { data: session } = await api.user.index.get({
		headers: await headers(),
	});
	// const { data: session } = await authClient.getSession({
	// 	fetchOptions: {
	// 		headers: await headers(),
	// 	},
	// });

	return (
		<div className="px-10 py-4 z-20">
			<div className="h-16 w-full border-gray-700 border flex items-center justify-between bg-primary rounded-3xl sticky px-10">
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
				{session?.user ? (
					<Link href={"/dashboard"} className="rounded-3xl">
						{session.user.email}
					</Link>
				) : (
					<Link href="/auth/signin" className=" text-foreground/80 text-[16px]" variant="link">
						Вход
					</Link>
				)}
			</div>
		</div>
	);
}
