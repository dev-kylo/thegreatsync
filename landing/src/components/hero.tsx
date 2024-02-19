import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-red">
      
  
      {/* <div className="relative isolate px-6 pt-14 lg:px-8 bg-[url('https://res.cloudinary.com/the-great-sync/image/upload/v1689097747/3000x2000/Closure_Floating_kxqprl.jpg')]"> */}
      <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen w-full">
            <Image
              src="https://res.cloudinary.com/the-great-sync/image/upload/c_crop,w_2000,h_1000/v1689097216/3000x2000/Execution_Closure_Scene_yobija.jpg"
              alt=""
              style={{zIndex: 0}}
              className="blur-sm object-cover"
              fill
              />
        {/* <div className="z-5 opacity-30 bg-slate-300 w-full h-[28rem] absolute top-1/2  px-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2  mx-auto max-w-4xl  py-32 sm:py-48 lg:py-56 "></div> */}
        <div className="absolute top-1/2 w-full px-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2  mx-auto max-w-4xl  py-32 sm:py-48 lg:py-56 z-10">
          {/* <div className="w-full absolute opacity-30 md:h-[26rem] bg-slate-400 top-0 "></div> */}
          <div className="text-center w-full z-50 ">
            <h1 className="text-5xl text-white drop-shadow-lg font-bold sm:text-7xl">
              {/* Struggling to grasp JavaScript?  */}
            No confidence with JavaScript?
            </h1>
            <p className="mt-6 sm:text-xl  font-bold text-white drop-shadow-2xl leading-6 sm:leading-8 ">
              You&lsquo;re trying to grasp concepts, build projects, and turn web development into an exciting career. But you're stuck!
            </p>
            <div className="bg-primary_blue p-4 mt-8 w-fit m-auto">
              <p className=" text-2xl text-white leading-8 "> Imagine knowing how to see the big picture!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
