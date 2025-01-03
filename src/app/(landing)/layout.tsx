import { type ReactNode } from "react"
import { Footer } from "~/components/footer"
import { Navbar } from "~/components/navbar"



export default function MainLayout({children}:
  {
    children:ReactNode
  }){

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  )
}
