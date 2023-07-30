import Image from "next/image";

export default function TwoTestimonials() {
    return (
      <section className="bg-white py-0 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20">

              <figure className="mt-10 flex flex-auto flex-col justify-between">
                <blockquote className="text-lg leading-8 text-gray-900">
                  <p>
                    “Kylo&#39;s teaching style with the amazing illustrations really helped me understand the confusing JS concepts. These illustrations and the story behind them are so creative and memorable. I will never forget the Genie who is going to sit on the island for every variable that I create!”
                  </p>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-x-6">
                  <Image
                    className="h-24 w-24 rounded-full bg-gray-50"
                    src="https://res.cloudinary.com/the-great-sync/image/upload/v1690543451/Emma_zggcsm.jpg"
                    alt=""
                    height={400}
                    width={400}
                  />
                  <div className="text-base">
                    <div className="font-semibold text-gray-900">Emma Wain</div>
                    <div className="mt-1 text-gray-500">Junior developer</div>
                  </div>
                </figcaption>
              </figure>
            </div>
            <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">

              <figure className="mt-10 flex flex-auto flex-col justify-between">
                <blockquote className="text-lg leading-8 text-gray-900">
                  <p>
                    “Kylo is a great teacher and a lot of care and thought has gone into the JavaScript mental model in a fun and interesting way! If you struggle to understand some of the more complex JavaScript concepts, definitely give The Great Sync a go! - Annie🦄⚡️”
                  </p>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-x-6">
                  <Image
                    className="h-24 w-24 rounded-full bg-gray-50"
                    src="https://res.cloudinary.com/the-great-sync/image/upload/v1690543698/X_79Eb72_400x400_eediqg.jpg"
                    alt=""
                    height={400}
                    width={400}
                  />
                  <div className="text-base">
                    <div className="font-semibold text-gray-900">Annie Bombanie</div>
                    <div className="mt-1 text-gray-500"> Front-End Engineering Lead</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    )
  }
  