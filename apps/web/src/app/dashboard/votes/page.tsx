import { api } from "~/lib/api";
import { CreateVotingForm } from "./create-voting";
import { VotingCard } from "~/components/voting-card";
import { headers } from "~/lib/server/headers";

export default async function VotesDashboard() {
	const { data: votings } = await api.votings.index.get({
		query: {
			self: true,
		},
		headers: await headers(),
	});

	return (
		<div className="grid gap-3 grid-cols-3 grid-flow-row">
			<CreateVotingForm />
			{votings?.map(voting => (
				<VotingCard key={voting.id} voting={voting} />
			))}
		</div>
	);
}
