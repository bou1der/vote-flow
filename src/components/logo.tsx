import LogoSvg from "public/logo.svg"
import Image, { type StaticImageData } from "next/image"
import Link from "./ui/link"

export function Logo(){
  return (
    <Link href="/" variant="underline" >
      <Image src={LogoSvg as StaticImageData} alt="VoteFlow" />
    </Link>
  )
}
