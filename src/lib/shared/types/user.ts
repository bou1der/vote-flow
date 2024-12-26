import { z } from "zod";
import { userRoleEnum } from "~/server/db/schema";
import { FileSchema } from "./file";

export const userRoleEnumSchema = z.enum(userRoleEnum.enumValues, {
  required_error: "Необходимо указать роль пользователя",
  invalid_type_error: "Неверный тип роли пользователя",
});
export type UserRole = z.infer<typeof userRoleEnumSchema>;

export const updateUserSchema = z.object({
  image:FileSchema.optional(),
  name:z.string().optional(),
  email:z.string().optional()
})
