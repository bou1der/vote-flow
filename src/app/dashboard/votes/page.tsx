
import { api } from "~/trpc/server"
import { CreateVotingForm } from "./create-voting"
import { VotingCard } from "~/components/voting-card"

export default async function VotesDashboard(){
  const votings = await api.voting.getAll({self:true})

  return (
    <div className="grid gap-3 grid-cols-3 grid-flow-row">
      <CreateVotingForm />
      {
        votings.map((voting) => (
          <VotingCard key={voting.id} voting={voting} />
        ))
      }
    </div>
  )
}
