'use client'
import { isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/client/utils";
import { OneVoting } from "~/lib/shared/types/votings";
import { api } from "~/trpc/react";



export function VoteSection({voting}:{
  voting:OneVoting
}){
  const sum = voting.answers.reduce((acc, curr) => acc + curr.votes ,0)
  const isVoted = voting.answers.find((a) => a.isVote === true)
  const [selectedId, setAnswer] = useState<string | undefined>(isVoted?.id)
  const router = useRouter()

  const VoteMutation = api.voting.vote.useMutation({
    onSuccess:() => {
      toast.success("Голос принят")
      router.refresh()
    },
    onError:(err) => {
      toast.error("Ошибка", {
        description:err.message
      })
    }
  })

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-2xl">Вопрос или тема?</h4>
      <p>Проголосовало всего: {sum}</p>

      <div className="w-full space-y-6 my-14">
        {
          voting.answers.map((ans) => (
            <div
              key={ans.id}
              className={
                cn("w-full flex justify-between group p-6 rounded-3xl transition-colors   hover:bg-white/10 hover:border-white/50 border-[3px] border-white/20 bg-white/5 cursor-pointer",
                  ans.id === selectedId ? "border-white/70!" : ""
                )
              }
              onClick={() => isVoted ? null : setAnswer(ans.id)}
            >
              <p className={cn(
                "transition-opacity group-hover:opacity-100",
                ans.id === selectedId ? "opacity-100" : ""
              )}>{ans.description}</p>
              {
                isVoted
                || isAfter(new Date(), voting.to)
                  ? (
                      <p className="opacity-100 text-lg font-semibold">{Math.round(sum > 0 ? ((ans.votes / sum) * 100) : 0)}%</p>
                    )
                  : null
              }
            </div>
          ))
        }
        <Button
          className="rounded-3xl w-40 mx-auto block"
          variant={"secondary"}
          onClick={() => {
            if(!selectedId) return toast.error("Выберите ответ")
            VoteMutation.mutate({
              answerId:selectedId,
              id:voting.id
            })
          }}
          disabled={!!isVoted || !!!selectedId || VoteMutation.isPending}
        >
          Завершить
        </Button>
      </div>
    </div>
  )
}
