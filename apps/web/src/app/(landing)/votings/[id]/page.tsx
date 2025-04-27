import { formatDistance, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "ui/components/breadcrumb";
import Editor from "ui/components/editor";
import { VoteSection } from "./vote-section";
import { DonatSection } from "./donation";
import { authClient } from "~/lib/client/auth-client";
import { headers } from "~/lib/server/headers";
import { api } from "~/lib/api";
import { notFound } from "next/navigation";

export default async function VotingPage({
	params,
}: {
	params: Promise<{
		id: string;
	}>;
}) {
	const id = (await params).id;

	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	const { data } = await api.votings.index.get({
		query: {
			filters: {
				ids: [id],
			},
		},
		headers: await headers(),
	});

	if (!data?.[0]) return notFound();
	const [voting] = data;

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
						<BreadcrumbSeparator>/</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink href={`/votings/${voting.id}`}>{voting.question}</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 className="font-semibold">{voting.question}</h1>
				<div className="flex gap-2">
					{session?.user.id === voting.createdBy ? null : <DonatSection votingId={voting.id} />}

					<span className="text-sm font-semibold px-6 py-3 bg-primary w-max rounded-3xl ">
						{isBefore(new Date(), voting.from)
							? `Начало черeз ${formatDistance(new Date(), voting.from, { locale: ru })}`
							: `Конец через ${formatDistance(new Date(), voting.to, { locale: ru })}`}
					</span>
				</div>

				<Editor className="my-10 border-none bg-white/0" text={voting.description} disabled />
				<VoteSection voting={voting} />
			</div>
		</div>
	);
}
