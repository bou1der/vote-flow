"use client";

import { Settings, Vote, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/client/utils";
import { CreateReviewForm } from "./create-review";
import { Logo } from "ui/components/custom/logo";
import Link from "ui/components/link";

export const routes = [
	{
		title: "Голосование",
		href: "/dashboard/votes",
		icon: <Vote />,
	},
	{
		title: "Кошельки",
		href: "/dashboard/wallets",
		icon: <Wallet />,
	},
	{
		title: "Настройки",
		href: "/dashboard/settings",
		icon: <Settings />,
	},
];

export function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="p-6 min-w-[280px] flex flex-col justify-stretch space-y-6 bg-primary">
			<div className="flex items-center justify-center">
				<Logo />
			</div>

			<div className="h-px w-full bg-gradient-to-r to-[#FFFFFF] from-[#999999]/20" />

			<div className="space-y-6 grow overflow-y-scroll">
				{routes.map(route => (
					<Link
						key={route.href}
						href={route.href}
						className={cn(
							pathname === route.href ? "border-border bg-primary" : " bg-white/0 border-white/0",
							"border  flex justify-start rounded-3xl text-lg p-5  gap-2 w-full",
						)}
					>
						{route.icon}
						{route.title}
					</Link>
				))}
			</div>

			<CreateReviewForm />
		</aside>
	);
}
