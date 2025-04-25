"use client";

import { Star, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "ui/components/custom/logo";
import Link from "ui/components/link";
import { cn } from "~/lib/client/utils";

export const routes = [
	{
		title: "Пользователи",
		href: "/admin/users",
		icon: <User />,
	},
	{
		title: "Отзывы",
		href: "/admin/reviews",
		icon: <Star />,
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

			<div className="space-y-6 grow overflow-y-scroll no-scrollbar">
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
		</aside>
	);
}
