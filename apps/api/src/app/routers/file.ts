import { eq } from "drizzle-orm";
import { getPlaiceholder } from "plaiceholder";
import Elysia, { error, t } from "elysia";
import mime from "mime-types";
import sharp from "sharp";
import { s3 } from "~/lib/s3";
import { userService } from "./user";
import { db, files } from "~/lib/db";
import { MAX_FILE_SIZE } from "shared/const";

export const fileRouter = new Elysia({ prefix: "/file" })
	.use(userService)
	.get(
		"/:id",
		async ({ params, set }) => {
			const file = await db.query.files.findFirst({
				where: eq(files.id, params.id),
			});

			if (!file) {
				return error(404, "Файл не найден");
			}

			set.headers["Content-Type"] = file.contentType;
			set.headers["Content-Disposition"] = `attachment; filename="${encodeURIComponent(file.fileName)}"`;
			return s3.file(file.id).stream();
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	)
	.post(
		"/",
		async ({ body, query }) => {
			const arrayBuffer = await body.file.arrayBuffer();
			let buf: Buffer<ArrayBuffer | ArrayBufferLike> = Buffer.from(arrayBuffer);

			if (query.isImage) {
				buf = await sharp(buf).webp().toBuffer();
			}

			const placeholder = query.isImage ? (await getPlaiceholder(buf)).base64 : undefined;

			const mimeType = mime.extension(body.file.name);
			const resolvedMimeType = mimeType ? mimeType : "application/octet-stream";

			let id: string | undefined;
			await db.transaction(async trx => {
				const [file] = await trx
					.insert(files)
					.values({
						fileName: body.file.name,
						fileSize: body.file.size,
						contentType: resolvedMimeType,
						placeholder,
					})
					.returning();

				id = file!.id;

				const metadata = s3.file(id);
				await metadata.write(buf, {
					type: resolvedMimeType,
				});
			});

			return id!;
		},
		{
			body: t.Object({
				file: t.File({
					maxSize: MAX_FILE_SIZE,
				}),
			}),
			query: t.Object({
				isImage: t.Optional(t.Boolean()),
			}),
			isSignedIn: true,
		},
	);
