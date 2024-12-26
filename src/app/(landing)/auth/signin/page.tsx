"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { OnError } from "~/lib/client/on_error";

export default function SignInPage() {
  const loginSchema = z.object({
    email: z
      .string({
        message: "Email обязателен для ввода",
      })
      .email({
        message: "Неверный формат Email",
      }),
  });

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {} as z.infer<typeof loginSchema>,
  });

  async function OnSubmit<P extends "email" | "google" | "github" | "yandex">({
    provider,
    data,
  }: {
    provider: P;
    data: P extends "email" ? z.infer<typeof loginSchema> : undefined;
  }) {
    try {
      const res = await signIn(provider, {
        redirect: false,
        ...data,
      });
      if (res?.error) {
        throw new Error(res.error);
      }

      router.push("/verification");
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="h-dvh container flex flex-col justify-center space-y-22 py-20">
      <h1 className="font-bold text-center text-2xl sm:text-5xl">Вход</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            OnSubmit({ provider: "email", data });
          }, OnError)}
          className="max-w-[400px] mx-auto w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormDescription>Почта</FormDescription>
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="h-12 rounded-2xl"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-12 rounded-2xl cursor-pointer"
          >
            Войти
          </Button>
        </form>
      </Form>
    </div>
  );
}
