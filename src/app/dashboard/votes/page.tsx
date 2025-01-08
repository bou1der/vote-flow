
import { api } from "~/trpc/server"
import { CreateVotingForm } from "./create-voting"

export default async function VotesDashboard(){
  const votings = await api.voting.getSelf()

  return (
    <div className="grid gap-3 grid-cols-3 grid-flow-row">
      <CreateVotingForm />
      {
        // votings.map((voting) => (
        //
        // ))
      }
    </div>
  )
}
