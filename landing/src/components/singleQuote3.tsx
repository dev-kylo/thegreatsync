import Image from "next/image";

export default function SingleQuote3() {
    return (
        <section className="relative isolate overflow-hidden bg-primary_blue px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p className="text-white">
                “I was blown away by the effectiveness of his unique teaching method. Kylo unleashes the full power of our imaginations, introducing memorable and meaningful illustration in order to work through different JavaScript concepts and challenges!”
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <Image
                className="mx-auto h-28 w-28 rounded-full"
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1690718187/Dan_s697rx.jpg"
                alt=""
                width={600}
                height={600}

        />
      
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-white"> Daniel Healy</div>
                <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-white">Developer</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }

