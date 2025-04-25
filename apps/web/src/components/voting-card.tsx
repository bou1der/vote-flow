import type { Voting } from "api/types";
import { User } from "lucide-react";
import Link from "next/link";
import { formatDistance, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "ui/components/image";

export function VotingCard({
	voting,
}: {
	voting: Voting;
}) {
	return (
		<Link href={`/votings/${voting.id}`} className="size-full flex flex-col justify-between gap-4">
			<div className="relative max-h-96">
				<Image
					src={voting.imageId}
					alt={voting.question}
					className="rounded-3xl size-full overflow-hidden"
					height={1200}
					width={1200}
				/>
				<span className="flex items-center justify-center text-base gap-2 absolute top-4 left-4 bg-black/20 min-w-20 p-0.5 rounded-2xl">
					<User className="size-6" />
					{voting.votes}
				</span>
			</div>
			<span className="text-base font-semibold">{voting.question}</span>
			<span className="text-sm font-semibold px-6 py-3 bg-primary w-max rounded-3xl ">
				{isBefore(new Date(), voting.from)
					? `Начало черeз ${formatDistance(new Date(), voting.from, { locale: ru })}`
					: `Конец через ${formatDistance(new Date(), voting.to, { locale: ru })}`}
			</span>
		</Link>
	);
}
