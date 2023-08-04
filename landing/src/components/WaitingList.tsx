import Image from "next/image";


export default function WaitingList() {


    const url ='https://thegreatsync.us7.list-manage.com/subscribe/post?u=4d0492b044ab95eee11a945a2&amp;id=5649b5fa7d&amp;f_id=0028d8e4f0';

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
            <h1 className="text-4xl text-white drop-shadow-lg font-bold sm:text-6xl">
              {/* Struggling to grasp JavaScript?  */}
             The Syncer Program is no longer accepting students.
            </h1>
            <h2 className="text-3xl text-white drop-shadow-lg mt-4 font-bold tracking-tight  sm:text-3xl">
              Join the waiting list and be the first to know when it re-opens
            </h2>
            <a
                href="https://thegreatsync.com/subscribe"
                type="button"
                className="rounded-md mt-8 bg-secondary_blue px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Join the waiting list
            </a>
            
  
          </div>
        </div>
      </div>
    </div>
  )
}
