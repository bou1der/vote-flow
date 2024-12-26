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
    <div className="w-full my-6">
      <div className="flex gap-2 text-lg font-semibold bg-primary py-2 px-3 rounded-3xl border">
        {currentRoute?.icon}
        {currentRoute?.title}
      </div>
    </div>
  )
}
