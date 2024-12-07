import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";


const values = [
  {
    name:"Светлана Р.",
    image:"...5",
    voites:15,
    description:"Никогда раньше не участвовала в таком интересном голосовании. Результаты мгновенные и понятные.",
  },
  {
    name:"Светлана Р.",
    image:"...4",
    voites:15,
    description:"Никогда раньше не участвовала в таком интересном голосовании. Результаты мгновенные и понятные.",
  },
  {
    name:"Светлана Р.",
    image:"...3",
    voites:15,
    description:"Никогда раньше не участвовала в таком интересном голосовании. Результаты мгновенные и понятные.",
  },
  {
    name:"Светлана Р.",
    image:"...1",
    voites:15,
    description:"Никогда раньше не участвовала в таком интересном голосовании. Результаты мгновенные и понятные.",
  },
  {
    name:"Светлана Р.",
    image:"...2",
    voites:15,
    description:"Никогда раньше не участвовала в таком интересном голосовании. Результаты мгновенные и понятные.",
  },
]

export function Reviews(){

  return (
    <div className="space-y-16 py-16 sm:py-20">
      <div className="space-y-4">
        <h1 className="font-bold text-center">Отзывы пользователей</h1>
        <p className="text-center">Нас выбирают за честность и удобство</p>
      </div>
      <Carousel
        opts={{
          startIndex:2,
          loop:true
        }}
      >
        <CarouselContent>
          {
            values.map((item) => (
              <CarouselItem className="sm:basis-1/2 mr-8 p-6 bg-primary rounded-3xl space-y-3" key={item.image}>
                <div className="w-full flex items-center gap-5">
                  <Avatar className="size-16">
                    <AvatarImage src={item.image} alt={item.name}>
                      <Image src={`/api/file/${item.image}`}  alt={item.name}/>
                    </AvatarImage>
                    <AvatarFallback className="text-background">
                      {item.name.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-white font-medium text-xl select-none">{item.name}</span>
                    <p className="select-none">{item.voites} голосов</p>
                  </div>
                </div>
                <span className="text-xl select-none">
                  {item.description}
                </span>
              </CarouselItem>
            ))
          }
        </CarouselContent>
      </Carousel>
    </div>
  )
}
