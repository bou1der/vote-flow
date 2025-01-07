import { Logo } from "./logo";
import Link from "./ui/link";
import { auth } from "~/server/auth";



export async function Navbar(){
  const session = await auth()

  return (
    <div className="px-10 py-4 z-20">
      <div className="h-16 w-full border-gray-700 border flex items-center justify-between bg-primary rounded-3xl sticky px-10">
        <Logo />
        <div>
          <Link variant="underline" className="text-foreground/80 text-[16px]" href="/">Главная</Link>
          <Link variant="underline" className="text-foreground/80 text-[16px]" href="/votes">Голосования</Link>
          <Link variant="underline" className="text-foreground/80 text-[16px]" href="/about">О проекте</Link>
        </div>
        {
          session 
            ? <Link href={"/dashboard"} className="rounded-3xl" >{session.user.email}</Link>
            : <Link href="/auth/signin" className=" text-foreground/80 text-[16px]" variant="underline">Вход</Link>
        }
      </div>
    </div>
  )
}
