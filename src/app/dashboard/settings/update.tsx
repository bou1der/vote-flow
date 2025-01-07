'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { OnError } from "~/lib/client/on_error"
import { updateUserSchema } from "~/lib/shared/types/user"
import { api } from "~/trpc/react"



export function UpdateForm({session}:{
  session:Session
}){
  const form = useForm({
    resolver:zodResolver(updateUserSchema),
    defaultValues: session.user as unknown as z.infer<typeof updateUserSchema>
  })
  const router = useRouter()

  const UpdateUserMutation = api.user.updateSelf.useMutation({
    onSuccess:() => {
      router.refresh()
      form.reset()
      toast.success("Профиль успешно обновлен")
    },
    onError:(err) => {
      toast.error("Ошибка обновления профиля", {
        description:err.message
      })
    }
  })

  const onSubmit = (data: z.infer<typeof updateUserSchema>) => {
    UpdateUserMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, OnError)}
        className="space-y-6 max-w-96"
      >
        <p className="opacity-100 font-bold">Личная информация</p>
        <FormField
          control={form.control}
          name="image"
          render={({field}) => (
            <FormItem>
              <FormDescription className=" text-lg text-white opacity-100">
                Фото
              </FormDescription>
              <FormControl>
                <Input
                  images={[field.value]}
                  onUpload={(f) => field.onChange(f[0]!)}
                  type="file"
                  accept="image/*"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormDescription className=" text-lg text-white opacity-100">
                Ник
              </FormDescription>
              <FormControl>
                <Input placeholder="Никнейм" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormDescription className=" text-lg text-white opacity-100">
                Почта
              </FormDescription>
              <FormControl>
                <Input disabled placeholder="Почта" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full rounded-3xl" disabled={UpdateUserMutation.isPending}>
          Сохранить
        </Button>
      </form>
    </Form>
  )
}
