import Image, {type StaticImageData } from "next/image"
import GradientSvg from "public/icons/gradient.svg"
import { cn } from "~/lib/client/utils"


export function Gradient({className}:
  {
    className?:string
  }
){

  return (
    <Image
      className={cn(className, "absolute bg-cover")}
      src={GradientSvg as StaticImageData}
      alt=""
    />
  )
}
