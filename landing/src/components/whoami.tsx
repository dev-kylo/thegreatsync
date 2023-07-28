import Image from "next/image";

export default function WhoAmI() {
    return (
      <section className="isolate overflow-hidden bg-white px-6 lg:px-8">
        <div className="relative mx-auto max-w-2xl pb-12 sm:pb-24  lg:max-w-4xl">

          <figure className="grid grid-cols-1 items-center gap-x-6  lg:gap-x-10">
            <div className="relative col-span-2 lg:col-start-1 lg:row-start-2">
              <blockquote className="text-lg font-semibold leading-6 text-gray-900 sm:text-2xl sm:leading-8 mb-4">
    
                <p>
                  I don&lsquo;t have a background in computer science. I studied Journalism... But it turns out it&lsquo;s not an in depth knowledge of computers you need. It&lsquo;s your creativity!
                </p>
              </blockquote>
            </div>
            <div className="col-end-1 w-72 lg:row-span-4 lg:w-[30rem]">

              <Image 
                className="rounded-xl bg-indigo-50 lg:rounded-3xl mb-4 md:mb-0"
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1689926354/Kylo_mr2yts.jpg"
                alt=""
                width={800}
                height={600}
              />
            <figcaption className="text-base lg:col-start-1 lg:row-start-3  block md:hidden">
              <div className="font-semibold text-gray-900">Kylo</div>
              <div className="mt-1 text-gray-500">Senior Javascript Developer</div>
            </figcaption>
            </div>
            <figcaption className="text-base lg:col-start-1 lg:row-start-3  hidden md:block">
              <div className="font-semibold text-gray-900">Kylo</div>
              <div className="mt-1 text-gray-500">Senior Javascript Developer</div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }
  