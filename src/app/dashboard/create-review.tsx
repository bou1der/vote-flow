'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { OnError } from "~/lib/client/on_error";
import { ReviewSchema } from "~/lib/shared/types/review";
import { api } from "~/trpc/react";



export function CreateReviewForm(){
  const [open, setOpen] = useState(false)
  const schema = ReviewSchema.omit({
    status:true,
  })


  const form = useForm({
    resolver:zodResolver(schema),
    defaultValues:{
      description:"",
      anonymous: false,
    }
  })

  const CreateReviewMutation = api.review.create.useMutation({
    onSuccess:() => {
      toast.success("Отзыв отправлен на рассмотрение")
      setOpen(false)
      form.reset()
    },
    onError:(err) =>{
      toast.error("Ошибка отправки отзыва", {
        description:err.message
      })
    }
  })

  const onSubmit = (data:z.infer<typeof schema>) => {
    CreateReviewMutation.mutate({...data, status:"WAITING"})
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>
          Оставить отзыв
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-5 flex flex-col justify-stretch">
        <SheetHeader>
          <SheetTitle>
            Оставить отзыв
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="flex flex-col justify-between grow"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem>
                    <FormDescription className="opacity-100 text-white text-lg">
                      Отзыв
                    </FormDescription>
                    <FormControl>
                      <Textarea {...field} className="bg-input max-h-96" placeholder="Я люблю голосовать за путина" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="anonymous"
                render={({field}) => (
                  <FormItem className="flex items-center justify-between">
                    <FormDescription className="opacity-100 text-white text-lg">
                      Анонимный отзыв
                    </FormDescription>
                    <FormControl>
                      <Switch onCheckedChange={field.onChange} checked={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={CreateReviewMutation.isPending}
            >
              Отправить
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
