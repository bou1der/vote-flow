'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { DialogClose } from "~/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { TabsContent } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { OnError } from "~/lib/client/on_error";
import { YooPaymentSchema } from "~/lib/shared/types/donations";
import { api } from "~/trpc/react";



export function FiatTab({votingId}:
  {
    votingId:string;
  }){

  const schema = YooPaymentSchema.omit({votingId:true})
  type Schema = z.infer<typeof schema>

  const form = useForm({
    resolver:zodResolver(schema),
    defaultValues: {} as Schema
  })

  const paymentMutation = api.yookassa.payment.useMutation({
    onSuccess(url) {
      if(url){
        window.open(url, "_self")
      }
    },
    onError(err){
      toast.error("Ошибка оплаты", {
        description:err.message
      })
    }
  })

  const onSubmit = (data:Schema) => {
    paymentMutation.mutate({...data, votingId})
  }


  return (
    <TabsContent value="fiat" className="mt-6">
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit, OnError)}
        >
          <FormField
            name="amount"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Сумма *
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Минимальная цена 2 ₽
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="comment"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Комментарий
                </FormLabel>
                <FormControl>
                  <Textarea {...field} className="max-h-60 bg-input min-h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {
            // <FormField
            //   name="type"
            //   control={form.control}
            //   render={({ field }) => (
            //     <Carousel>
            //       <CarouselContent className="m-0 p-0">
            //         {
            //           Object.keys(YooPaymentType).map((key) => {
            //             const Icon = YooPaymentType[key as PaymentType]
            //             return  (
            //               <CarouselItem className="basis-1/4 pl-0">
            //                 <div onClick={() => field.onChange(key)} className={cn( key === field.value ? "bg-primary !border-input border" : ""," transition-colors border border-input/0 size-24 p-4 flex items-center justify-center hover:bg-primary cursor-pointer rounded-2xl")}>
            //                   <Icon className="size-full aspect-square" />
            //                 </div>
            //               </CarouselItem>
            //             )
            //           })
            //         }
            //       </CarouselContent>
            //     </Carousel>
            //   )}
            // />
          }

          <div className="flex gap-2">
            <DialogClose
              disabled={paymentMutation.isPending}
              asChild
            >
              <Button
                variant={"destructive"}
                className="basis-1/2 font-semibold"
                disabled={paymentMutation.isPending}
                type="button"
              >
                Отменить
              </Button>
            </DialogClose>
            <Button
              className="basis-1/2 bg-green-500 text-white hover:bg-green-400 font-semibold"
              variant={"secondary"}
              disabled={paymentMutation.isPending}
            >
              Отправить
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  )
}
