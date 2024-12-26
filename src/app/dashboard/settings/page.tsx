import { auth } from "~/server/auth";
import { UpdateForm } from "./update";
import { redirect } from "next/navigation";



export default async function SettingsDashboard(){
  const session = await auth()

  if(!session) redirect("/auth/signin")

  return (
    <UpdateForm session={session} />
  )
}
