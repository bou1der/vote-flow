'use client'
'use no memo'

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import Editor from "~/components/ui/editor"
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet"
import { OnError } from "~/lib/client/on_error"
import { VotingSchema } from "~/lib/shared/types/votings"
import { api } from "~/trpc/react"


export function CreateVotingForm(){
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver:zodResolver(VotingSchema),
    defaultValues: {} as z.infer<typeof VotingSchema>
  })

  const CreateVotingMutation = api.voting.create.useMutation({
    onSuccess: () => {
      toast.success("Голосование успешно создано")
      form.reset()
    },
    onError: (err) => {
      toast.error("Ошибка создания голосования", {
        description:err.message
      })
    }
  })

  const ansRefs = useRef<HTMLInputElement[]>([])

  const answers = useFieldArray({
    name:"answers" as never,
    control: form.control,
  })

  useEffect(() => {
    if(answers.fields.length === 0) answers.append("");
  }, [answers.fields])

  const onSubmit = (data:z.infer<typeof VotingSchema>) => {
    CreateVotingMutation.mutate(data)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="order-first cursor-pointer min-h-[446px]">
        <div className="size-full flex flex-col items-center justify-center">
          <Plus className="size-16" />
          <p className="opacity-100 text-xl">Создать голосование</p>
        </div>
      </SheetTrigger>
      <SheetContent className="space-y-4 overflow-y-scroll no-scrollbar max-w-sm sm:max-w-2xl">
        <SheetTitle>
          <SheetHeader>
            Создание голосования
          </SheetHeader>
        </SheetTitle>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit, OnError)}
            className="space-y-6 "
          >
            <FormField
              name="image"
              control={form.control}
              render={({field}) => (
                <FormItem className="w-full">
                  <FormDescription>Обложка*</FormDescription>
                  <FormControl>
                    <Input
                      images={field.value}
                      onUpload={(f) => field.onChange(f[0]!)}
                      aspectClassName="w-full! h-40!"
                      className="w-full!"
                      type="file"
                      accept="image/*"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="question"
              control={form.control}
              render={({field}) => (
                <FormItem className="w-full">
                  <FormDescription>Вопрос*</FormDescription>
                  <FormControl>
                    <Input placeholder="Почему ОН а не Я" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="dates"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormDescription>Дата проведения*</FormDescription>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full" variant={"input"}>
                          <p className="text-sm w-full text-left">
                            {
                              field.value?.from && field.value?.to
                                ? `С ${format(field.value.from as Date, "dd.MM.yyyy")} по ${format(field.value.to as Date, "dd.MM.yyyy")}`
                                : "Выберите дату"
                            }
                          </p>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background border-input">
                        <Calendar
                          mode="range"
                          fromDate={new Date()}
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({field}) => (
                <FormItem className="w-full">
                  <FormDescription>Описание*</FormDescription>
                  <FormControl>
                    <Editor setText={field.onChange} options={{quotes:true}} text={field.value} />
                  </FormControl>
                </FormItem>
              )}
            />

            {
              answers.fields.map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`answers.${index}`}
                  render={({field}) => (
                    <FormItem>
                      <FormDescription>Ответ {index + 1}*</FormDescription>
                      <FormControl>
                        <Input
                          ref={(el) => {
                            if(el) ansRefs.current[index] = el
                          }}
                          onKeyUp={() => {
                            const last = ansRefs.current[ansRefs.current.length - 1];
                            if(last) last.focus()
                          }}
                          onChange={(e) => {
                            if(e.target.value === ""){
                              answers.remove(index)
                            } else {
                              field.onChange(e.target.value)
                            }
                          }}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))
            }
            {
              answers.fields.length < 5 
                ? (
                  <Button
                    className="w-full"
                    variant={"input"}
                    type="button"
                    onClick={() => answers.append("")}

                  >
                    <p className="flex items-center gap-2 w-full  text-sm">
                      <Plus className="size-4" />
                      Добавить ответ
                    </p>
                  </Button>
                ) : null
            }

            <Button disabled={CreateVotingMutation.isPending}>Сохранить</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )

}
