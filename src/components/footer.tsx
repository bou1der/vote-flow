import { auth } from "~/server/auth"
import { Logo } from "./logo"
import Link from "./ui/link"

export async function Footer(){
  const session = await auth()

  return (
    <div className="bg-primary w-full">
      <div className="container flex flex-col gap-6 py-12">
        <div className="flex justify-between border-b border-white/15 py-7">
          <Logo />
          <div>
            <Link variant="underline" className="text-foreground/80 text-[16px]" href="/">Главная</Link>
            <Link variant="underline" className="text-foreground/80 text-[16px]" href="/">Голосования</Link>
            <Link variant="underline" className="text-foreground/80 text-[16px]" href="/">О проекте</Link>
          </div>
        </div>

        <div className="flex justify-between items-baseline pb-6">
          <p className="text-white/60">2024. Все права защищены</p>
          <Link variant="secondary" className="px-12 rounded-3xl" href="/auth/signin">Войти</Link>
        </div>
      </div>
    </div>
  )
}
