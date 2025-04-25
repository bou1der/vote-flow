import type { ReactNode } from "react";

export default function VotingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="w-full pt-16 sm:pt-32">{children}</div>
    </>
  );
}
