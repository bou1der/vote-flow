import { formatDistance, isBefore } from "date-fns"
import { ru } from "date-fns/locale"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/components/ui/breadcrumb"
import Editor from "~/components/ui/editor"
import { api } from "~/trpc/server"
import { VoteSection } from "./vote-section"



export default async function VotingPage({params}:
  {
    params:Promise<{
      id:string
    }>
  }){
  const id = (await params).id
  const voting = await api.voting.getOne({id})
  


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
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/votings/${voting.id}`}>{voting.question}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold">{voting.question}</h1>
        <span className="text-sm font-semibold px-6 py-3 bg-primary w-max rounded-3xl ">
          {
            isBefore(new Date(), voting.from)
              ? `Начало черeз ${formatDistance(new Date(), voting.from, {locale:ru})}`
              : `Конец через ${formatDistance(new Date(), voting.to, {locale:ru})}`
          }
        </span>

        <Editor className="my-16 border-none bg-white/0" text={voting.description} disabled />
        <VoteSection voting={voting} />
      </div>
    </div>
  )
}
