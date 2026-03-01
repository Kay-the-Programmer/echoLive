"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel"
import { placeholderImages } from "@/lib/data"

export function EventCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, direction: 'forward' })
  )

  const pkEventImage = placeholderImages.find(p => p.id === 'pk-event');

  const events = [
    {
      id: 1,
      image: pkEventImage?.imageUrl,
      hint: pkEventImage?.imageHint,
      title: "Official 1v1 PK Event",
      date: "09/01/2026-12/01/2026(UTC+8)",
      reward: "2,400,000 rewards & an exclusive event medal!",
    },
    {
      id: 2,
      image: "https://picsum.photos/seed/event2/800/250",
      hint: "concert stage",
      title: "Summer Music Festival",
      date: "This Weekend!",
      reward: "Exclusive badges and gifts!",
    }
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.id}>
            <div className="relative aspect-[16/5] w-full overflow-hidden rounded-lg">
              {event.image && (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  data-ai-hint={event.hint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <h3 className="font-bold text-white text-lg md:text-xl drop-shadow-md">{event.title}</h3>
                <p className="text-white/80 text-xs md:text-sm drop-shadow-md">{event.date}</p>
                <p className="text-amber-300 text-xs md:text-sm font-semibold drop-shadow-md mt-1">{event.reward}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}
