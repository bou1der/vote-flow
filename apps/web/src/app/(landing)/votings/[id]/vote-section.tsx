"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { Voting } from "api/types";
import { isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TreatyError } from "shared/types/utils";
import { toast } from "sonner";
import { Button } from "ui/components/button";
import { Skeleton } from "ui/components/skeleton";
import { api } from "~/lib/api";
import { handleTreatyError } from "~/lib/client/query-client";
import { cn } from "~/lib/client/utils";

export function VoteSection({
	voting,
}: {
	voting: Voting;
}) {
	const { data: answers, isPending } = useQuery({
		queryKey: ["get", "answers", voting.id],
		queryFn: async () => {
			const res = await api.votings({ id: voting.id }).get();
			if (res.error) throw handleTreatyError(new TreatyError(res.error));
			return res.data;
		},
	});
	const isVoted = useMemo(() => answers?.find(a => a.isVoted), [answers]);
	const sum = useMemo(() => answers?.reduce((acc, a) => acc + a.votes, 0), [answers]);

	const [selectedId, setAnswer] = useState<string | undefined>(isVoted?.id);
	const router = useRouter();

	const voteMutation = useMutation({
		mutationKey: ["vote", voting.id],
		mutationFn: async () => {
			if (selectedId) {
				const res = await api.votings({ id: voting.id }).post({
					answerId: selectedId,
				});
				if (res.error) throw new TreatyError(res.error);
				return res.data;
			}
		},
		onSuccess: () => {
			toast.success("Голос принят");
			router.refresh();
		},
	});

	return (
		<div className="space-y-4">
			<h4 className="font-semibold text-2xl">Вопрос или тема?</h4>
			<p>Проголосовало всего: {sum} </p>

			<div className="w-full space-y-6 my-14">
				{!answers || isPending ? (
					<>
						<Skeleton className="w-full ronded-xl h-11" />
						<Skeleton className="w-full ronded-xl h-11" />
						<Skeleton className="w-full ronded-xl h-11" />
					</>
				) : (
					answers.map(ans => (
						<div
							key={ans.id}
							className={cn(
								"w-full flex justify-between group p-6 rounded-3xl transition-colors   hover:bg-white/10 hover:border-white/50 border-[3px] border-white/20 bg-white/5 cursor-pointer",
								ans.id === selectedId || ans.isVoted ? "border-white/70!" : "",
							)}
							onClick={() => (isVoted ? null : setAnswer(ans.id))}
						>
							<p
								className={cn(
									"transition-opacity group-hover:opacity-100",
									ans.id === selectedId || ans.isVoted ? "opacity-100" : "",
								)}
							>
								{ans.description}
							</p>
							{isVoted || isAfter(new Date(), voting.to) ? (
								<p className="opacity-100 text-lg font-semibold">
									{sum ? (
										Math.round(sum > 0 ? (ans.votes / sum) * 100 : 0)
									) : (
										<Skeleton className="w-6 h-5 rounded-md" />
									)}
									%
								</p>
							) : null}
						</div>
					))
				)}
				<Button
					className="rounded-3xl w-40 mx-auto block"
					variant={"secondary"}
					onClick={() => {
						if (!selectedId) return toast.error("Выберите ответ");
						voteMutation.mutate();
					}}
					disabled={!!isVoted || !selectedId || voteMutation.isPending}
				>
					Завершить
				</Button>
			</div>
		</div>
	);
}
