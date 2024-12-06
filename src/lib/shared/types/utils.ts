import { z } from "zod";

export const IdSchema = z.object({
  id: z
    .string({
      required_error: "Необходимо указать идентификатор",
      invalid_type_error: "Неверный тип идентификатора",
    })
    .min(1, "Необходимо указать идентификатор"),
});


export const phone = z.string({
  required_error:"Телефон не заполнен",
  message:"Телефон не является строкой",
})
.regex(/^(?:\+7|7|8)?\s*\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/, "Неправильный формат номера")

export const title = z.string({
  required_error:"Заголовок не заполнен",
  message:"Заголовок не является строкой",
})

export const description = z.string({
  required_error:"Описание не заполнено",
  message:"Описание не является строкой",
})

