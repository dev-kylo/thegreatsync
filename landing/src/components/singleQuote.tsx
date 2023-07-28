import Image from "next/image";

export default function SingleQuote() {
    return (
      <section className="relative isolate overflow-hidden bg-primary_blue px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p className="text-white">
                “When I pivoted into software development and had to learn JavaScript, I was faced with a lot of theoretical concepts that were difficult to remember even after weeks of learning.
                 I would often have to go back to them repeatedly, and it felt like I was making little progress. 
                 Then, I came across The Great Sync. 
                 My initial thoughts were that it was too good to be true. 
                 I couldnI&lsquo;mt imagine learning JavaScript visually. 
                 Fortunately, it turned out to be everything I needed to effortlessly grasp JavaScript concepts.”
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <Image
                className="mx-auto h-28 w-28 rounded-full"
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1690481761/Carl_Bebli_piodpj.jpg"
                alt=""
                width={600}
                height={600}

/>
      
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-white"> Carl Bebli</div>
                <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-white">Software Developer</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }