import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import type { NextRequest } from "next/server";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { s3 } from "~/server/s3";

export async function GET(
  req: NextRequest,
  context: { params:Promise<{ id: string }> },
) {
  const id = (await context.params).id
  const caller = createCaller(
    await createTRPCContext({
      headers: req.headers,
    }),
  );

  try {
    const file = await caller.file.get({
      id: id,
    });

    const stream = await s3.get(file.objectId);

    return new Response(stream, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.fileName)}"`,
        "Content-Encoding": "base64",
      },
    });
  } catch (cause) {
    console.error(cause);
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return new Response(cause.message, {
        status: httpCode,
      });
    }
    return new Response("Внутренняя ошибка сервера", {
      status: 500,
    });
  }
}
