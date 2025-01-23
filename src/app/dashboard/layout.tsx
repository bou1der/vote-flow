import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "~/server/auth";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";




export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }


  return (
    <div className="w-dvw h-dvh flex gap-6">
      <Sidebar />
      <div className="grow pb-4 max-h-screen overflow-y-scroll no-scrollbar px-6">
        <div className="size-full flex flex-col justify-stretch ">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
