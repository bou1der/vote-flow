'use client'
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { UserRejectsError } from "@tonconnect/sdk";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { TabsContent } from "~/components/ui/tabs";
import { useTonWallet } from "~/hooks/wallet";
import { OnError } from "~/lib/client/on_error";



export function CryptoTab({votingId}:
  {
    votingId:string; 
  }){

  const {ton} = useTonWallet()

  // const schema = z.object({
  //
  // })

  const form = useForm()

  const cryptoMutation = useMutation({
    async onMutate() {
      await ton.sendTransaction({
        validUntil: Math.round(Date.now() / 1000) + 600,
        messages:[
          {
            address:'0' + '0'.repeat(64),
            amount:`10000`
          }
        ]
      })
    },
    onError(error) {
      if(error instanceof UserRejectsError){
        return toast.error("Транзакция отклонена")
      }
      toast.error("Ошибка транзакции", {
        description: error.message
      })
    },
  })

  const onSubmit = (data:any) => {
    cryptoMutation.mutate()
  }

  return (
    <TabsContent value="crypto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, OnError)}
        >

          <div className="flex gap-2">
            <DialogClose
              disabled={cryptoMutation.isPending}
              asChild
            >
              <Button
                variant={"destructive"}
                className="basis-1/2 font-semibold"
                disabled={cryptoMutation.isPending}
                type="button"
              >
                Отменить
              </Button>
            </DialogClose>
            <Button
              className="basis-1/2 bg-green-500 text-white hover:bg-green-400 font-semibold"
              variant={"secondary"}
              disabled={cryptoMutation.isPending}
            >
              Отправить
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  )
}
