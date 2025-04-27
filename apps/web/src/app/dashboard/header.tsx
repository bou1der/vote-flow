"use client";
import { usePathname } from "next/navigation";
import { routes } from "./sidebar";
import { useMemo } from "react";
import { Button } from "ui/components/button";
import { LogOut } from "lucide-react";
import Link from "ui/components/link";

export function DashboardHeader() {
	const pathname = usePathname();
	const currentRoute = useMemo(() => routes.find(route => route.href === pathname), [pathname]);

	return (
		<div className=" w-full sticky top-6 z-10 my-6">
			<div className="flex justify-between items-center text-lg font-semibold bg-[#1e2134] py-2 px-3 rounded-3xl border">
				<div className="flex gap-2">
					{currentRoute?.icon}
					{currentRoute?.title}
				</div>

				<Link href={"/auth/signout"} className="size-4 p-0.5 hover:bg-white/0 mr-2" variant={"ghost"}>
					<LogOut className="text-destructive !size-5" />
				</Link>
			</div>
		</div>
	);
}
