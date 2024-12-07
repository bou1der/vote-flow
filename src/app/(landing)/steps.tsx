'use client'
import Image, { type StaticImageData } from "next/image";
import { ReactNode } from "react";
import HandlesSvg from "public/images/handles.svg"
import { motion, useScroll } from "framer-motion"


export function Steps(){

  return (
    <div className="container space-y-16 py-16 sm:py-20">
      <div className="space-y-4">
        <h1 className="font-bold text-center">Простые шаги к вашему голосу</h1>
        <p className="text-center">Голосовать легко: четыре шага к результату</p>
      </div>

      <div className="flex justify-between items-stretch">
        <div className="w-1/2 space-y-8">
          <SeletedCard>
            <h4 className="font-bold">Поделитесь с друзьями</h4>
            <p>Предложите то, что важно для обсуждения.</p>
          </SeletedCard>
          <SeletedCard>
            <h4 className="font-bold">Поделитесь с друзьями</h4>
            <p>Предложите то, что важно для обсуждения.</p>
          </SeletedCard>
          <SeletedCard>
            <h4 className="font-bold">Поделитесь с друзьями</h4>
            <p>Предложите то, что важно для обсуждения.</p>
          </SeletedCard>
          <SeletedCard>
            <h4 className="font-bold">Поделитесь с друзьями</h4>
            <p>Предложите то, что важно для обсуждения.</p>
          </SeletedCard>
        </div>
        <Image src={HandlesSvg as StaticImageData} alt="" />
      </div>
    </div>
  )
}

function SeletedCard({children}:
  {
    children:ReactNode
  }){
  const { scrollYProgress } = useScroll()

  return (
    <motion.div  style={{opacity:scrollYProgress}}>
      {children}
    </motion.div>
  )
}
// className="space-y-2 hover:bg-primary p-6 rounded-3xl border border-gray-500/50 w-full"
