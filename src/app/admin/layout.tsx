import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "~/server/auth";
import { Sidebar } from "./sidebar";
import { AdminHeader } from "./header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="w-dvw h-dvh flex gap-6">
      <Sidebar />
      <div className="grow max-h-screen overflow-y-scroll no-scrollbar px-6">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
