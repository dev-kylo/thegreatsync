import Image from "next/image";

export default function SingleQuote3() {
    return (
        <section className="relative isolate overflow-hidden bg-primary_blue px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p className="text-white">
                “As a visual learner, I was captivated by how the course weaves together JavaScript concepts and memory techniques, forming a systematic yet vivid mental models for learning JavaScript. Kylo, the course creator, has discovered the perfect blend for effective learning. The exercises not only test my grasp of key concepts but also build up my ability to write clean code. Throughout the journey, Kylo's unwavering support has been a constant source of motivation. It's a transformative experience for anyone looking to delve into the world of JavaScript.”
              </p>
            </blockquote>
            <figcaption className="mt-10">
      
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-white"> Shanis</div>
                <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-white pr-8"> ~ Student studying full stack web development</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }

