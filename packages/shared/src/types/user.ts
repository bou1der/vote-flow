import { z } from "zod";

export const UserRoleValues = ["admin", "user"];

export const UserRoleEnumSchema = z.enum(["admin", "user"], {
	required_error: "Необходимо указать роль пользователя",
	invalid_type_error: "Неверный тип роли пользователя",
});

export type UserRole = z.infer<typeof UserRoleEnumSchema>;
