"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "~/lib/client/utils";
import type { VotingStatus } from "~/lib/shared/types/votings";

export function SearchFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState<VotingStatus | null>(
    searchParams.get("status") as VotingStatus | null,
  );

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    for (const [key, value] of searchParams) {
      if (key !== "status") {
        newParams.set(key, value);
      }
    }
    if (query) {
      newParams.set("status", query);
    } else {
      newParams.delete("status");
    }
    router.push(`${pathname}?${newParams.toString()}`);
  }, [pathname, query, router]);

  return (
    <div className="w-full h-10 border-b border-white/40 flex flex-row items-stretch gap-6">
      <div
        className={cn(
          "flex items-center cursor-pointer transition-all",
          !query ? "border-b-2" : "opacity-40",
        )}
        onClick={() => setQuery(null)}
      >
        <p className="text-base opacity-100 font-semibold">ВСЕ ГОЛОСОВАНИЯ</p>
      </div>

      <div
        className={cn(
          "flex items-center cursor-pointer transition-all",
          query === "OPEN" ? "border-b-2" : " opacity-40",
        )}
        onClick={() => setQuery("OPEN")}
      >
        <p className="text-base opacity-100 font-semibold">ОТКРЫТЫЕ</p>
      </div>

      <div
        className={cn(
          "flex items-center cursor-pointer transition-all",
          query === "CLOSED" ? "border-b-2" : " opacity-40",
        )}
        onClick={() => setQuery("CLOSED")}
      >
        <p className="text-base opacity-100 font-semibold">ЗАВЕРШЕННЫЕ</p>
      </div>
    </div>
  );
}
