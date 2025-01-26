import { createHmac } from "crypto"
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { NextRequest } from "next/server";

export async function POST(
  req:NextRequest,
){
  try {

    console.log(req)

    const signature = req.headers.get("signature")

    if(!signature){
      throw new TRPCError({
        code:"FORBIDDEN",
        message:"бб"
      })
    }


    // const [version, hmac, timestamp] = signature.split(' ');
    //
    // const hmacGenerated = createHmac('sha256', env.YOOKASSA_API)
    //     .update(JSON.stringify(await req.json()))
    //     .digest('base64');
    //
    // // Формируем подпись в нужном формате
    // const generatedSignature = `${version} ${hmacGenerated} ${timestamp}`;



    // const hmac = createHmac("sha256", env.YOOKASSA_API)
    // hmac.update(JSON.stringify(await req.json()))
    // const verifySign = `v1 ${hmac.digest("base64")}`

    // console.log(generatedSignature)
    // console.log("-------------------")
    // console.log(signature)

    // console.log(req)
    // console.log(req.body)
    // console.log("--------------------------------------------")


    return new Response("ok", {
      status:200
    })
  } catch (cause) {
    console.error(cause)
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
