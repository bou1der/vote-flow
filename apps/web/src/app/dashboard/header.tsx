'use client'
import { usePathname } from "next/navigation";
import { routes } from "./sidebar";
import { useMemo } from "react";



export function DashboardHeader(){
  const pathname = usePathname()
  const currentRoute = useMemo(
    () => routes.find((route) => route.href === pathname)
    , [pathname])

  return (
    <div className="w-full sticky top-6 z-10 my-6">
      <div className="flex gap-2 text-lg font-semibold bg-[#1e2134] py-2 px-3 rounded-3xl border">
        {currentRoute?.icon}
        {currentRoute?.title}
      </div>
    </div>
  )
}
