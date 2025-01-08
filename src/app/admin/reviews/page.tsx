import { DataTable } from "~/components/ui/data-table"
import { api } from "~/trpc/server"
import { columns } from "./columns"


export default async function ReviewsAdmin(){
  const reviews = await api.review.getAll()

  return (
    <DataTable
      data={reviews}
      columns={columns}
    />
  )
}
