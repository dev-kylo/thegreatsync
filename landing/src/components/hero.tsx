import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-red">
  
      {/* <div className="relative isolate px-6 pt-14 lg:px-8 bg-[url('https://res.cloudinary.com/the-great-sync/image/upload/v1689097747/3000x2000/Closure_Floating_kxqprl.jpg')]"> */}
      <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen">
            <Image
              src="https://res.cloudinary.com/the-great-sync/image/upload/v1689097747/3000x2000/Closure_Floating_kxqprl.jpg"
              alt=""
              style={{zIndex: 0}}
              className="blur-sm"
              fill
              />
        <div className="absolute top-1/2 w-full px-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2  mx-auto max-w-4xl  py-32 sm:py-48 lg:py-56 z-10">
          <div className="text-center w-full">
            <h1 className="text-4xl text-white font-bold sm:text-7xl">
              Struggling to grasp JavaScript? 
            </h1>
            <h2 className="text-3xl text-white mt-4 font-bold tracking-tight  sm:text-3xl">
              It's time to visualize and see the big picture.
            </h2>
            <p className="mt-6 text-2xl text-white leading-8 ">
              You're trying to level up, build projects, and turn web development into an exciting career. All that stands in your way is JavaScript. 
            </p>
            <div className="bg-primary_blue p-4 mt-8 w-fit m-auto">
              <p className=" text-2xl text-white leading-8 "> What if you had the confidence to build anything?</p>
            </div>

          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
