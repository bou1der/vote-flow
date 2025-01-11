import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { SearchFilters } from "./search";
import { VotingStatus } from "~/lib/shared/types/votings";
import { api } from "~/trpc/server";
import { VotingCard } from "~/components/voting-card";

export default async function VotesPage({searchParams}:
  {
    searchParams:{
      status?:VotingStatus
    }
  }){

  const votings = await api.voting.getAll({
    status:searchParams.status
  })

  return (
    <div className="container min-h-screen">
      <div className="space-y-6">
        <Breadcrumb >
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
        <SearchFilters />
        <div className="grid gap-3 grid-cols-3 grid-flow-row" >
          {
            votings.map((v) => (
              <VotingCard
                key={v.id}
                voting={v}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
