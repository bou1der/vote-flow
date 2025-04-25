import { t } from "elysia";
import { z } from "zod";

export const UserRoleValues = ["admin", "user"];

export const UserRoleEnumSchema = z.enum(["admin", "user"], {
	required_error: "Необходимо указать роль пользователя",
	invalid_type_error: "Неверный тип роли пользователя",
});

export const UserFormSchema = z.object({
	image: z.instanceof(File).optional(),
	name: z.string().optional(),
	// email: z.string().email().optional(),
});
export const UserSchema = t.Object({
	image: t.File(),
	name: t.String(),
	// email: t.String({ format: "email" }),
});

export type UserRole = z.infer<typeof UserRoleEnumSchema>;
