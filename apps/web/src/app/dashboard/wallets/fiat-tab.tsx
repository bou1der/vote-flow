"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TreatyError } from "shared/types/utils";
import { Skeleton } from "ui/components/skeleton";
import { TabsContent } from "ui/components/tabs";
import { api } from "~/lib/api";
import { ru } from "date-fns/locale";
import { handleTreatyError } from "~/lib/client/query-client";

export function FiatTab() {
	const { data: session, isPending: isPendingSession } = useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await api.user.index.get();
			if (res.error) throw handleTreatyError(new TreatyError(res.error));
			return res.data;
		},
	});
	const { data: payments, isPending: isPendingPayments } = useQuery({
		queryKey: ["get", "self", "payments"],
		queryFn: async () => {
			const res = await api.payments.index.get();
			if (res.error) throw handleTreatyError(new TreatyError(res.error));
			return res.data;
		},
	});

	return (
		<TabsContent className="w-full flex" value="fiat">
			<div className="w-full">
				<div className="px-4 py-6 bg-input rounded-lg w-max flex gap-2">
					<h1>Баланс:</h1>
					<h1 className="flex items-baseline">
						{!session || isPendingSession ? <Skeleton className="w-36 h-11" /> : session.user.balance}₽
					</h1>
				</div>
			</div>
			<aside className="min-w-72 space-y-6 pt-0 px-2 py-4 overflow-scroll">
				{!payments || isPendingPayments ? (
					<>
						<Skeleton className="w-full h-20 rounded-lg" />
						<Skeleton className="w-full h-20 rounded-lg" />
						<Skeleton className="w-full h-20 rounded-lg" />
					</>
				) : (
					payments.map(payment => (
						<div key={payment.id} className="bg-input shadow-inner w-full rounded-lg p-4 space-y-1">
							<span className="flex justify-between items-start">
								<h4 className="text-green-500 ">+{payment.amount}₽</h4>
								<p className="text-sm text-muted-foreground">
									{format(payment.createdAt, "dd.MM.yyyy", { locale: ru })}
								</p>
							</span>
							<p className="text-muted-foreground">от: Аноним</p>
							<div>
								<p className="text-sm">Комментарий:</p>
								<p>{payment.comment || "Комментарий отсутсвует"}</p>
							</div>
						</div>
					))
				)}
			</aside>
		</TabsContent>
	);
}
