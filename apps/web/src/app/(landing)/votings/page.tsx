"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { TreatyError } from "shared/types/utils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "ui/components/breadcrumb";
import { VotingCard } from "~/components/voting-card";
import { api } from "~/lib/api";
import { handleTreatyError } from "~/lib/client/query-client";

export default function VotesPage() {
	const { data: votings } = useSuspenseQuery({
		queryKey: ["get", "all", "votings"],
		queryFn: async () => {
			const res = await api.votings.index.get({ query: {} });
			if (res.error) throw handleTreatyError(new TreatyError(res.error));
			return res.data;
		},
	});

	return (
		<div className="container min-h-screen">
			<div className="space-y-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Главная</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>/</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink href="/votings">Голосования</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 className="font-semibold">Голосования</h1>
				<div className="grid gap-3 grid-cols-3 grid-flow-row">
					{votings.map(v => (
						<VotingCard key={v.id} voting={v} />
					))}
				</div>
			</div>
		</div>
	);
}
