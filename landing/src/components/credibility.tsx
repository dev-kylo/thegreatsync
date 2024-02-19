import Image from "next/image";


export default function Credibility() {
  return (
    <div className="bg-white px-6 py-32  pt-0 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
      
    <article className="prose lg:prose-2xl">
 
        <div className='flex flex-col items-center'>
            <span className='text-6xl font-bold tracking-tight mb-8'>Hi, I&lsquo;m Kylo </span>
        </div>
        <p className="mt-6 text-xl leading-8 text-gray-700"> I am not an engineer at Google or Netflix. I do not work on the React team or a world famous library.</p>
        <p className="mt-6 text-xl leading-8 text-gray-700"> But I am a senior Javascript developer who career-transitioned. My journey began by learning on the side of a day-job and giving every spare hour to coding.</p>
        <p className="mt-6 text-xl leading-8 text-gray-700"> I went on to build a career I love. It has allowed me to work in 3 different countries, and develop many applications I&lsquo;m proud of. </p>
        <p className="mt-6 text-xl leading-8 text-gray-700">Having the skills to build any web app is not the only reason I love what I do. I also have the privilege of helping others, and over the years I have mentored and coached dozens of students into professional developers.</p>
        <p className="mt-6 text-xl leading-8 text-gray-700">It turns out you don’t need to think like a computer. And the visual teaching methods I use actively encourages you to bring your own creative perspective to any problem.</p>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          My work is featured in
        </h2>
        <div className="mx-auto mt-10 max-w-2xl w-full grid  lg:space-x-7 grid-cols-1 lg:grid-cols-3">
          <Image
            className="col-span-2 max-h-20 md:max-h-12 w-full object-cover lg:col-span-1"
            src="https://res.cloudinary.com/the-great-sync/image/upload/v1690484635/Misx/smashing-magazine6563_gvsui2.jpg"
            alt="Smashing Magazine logo"
            width={158}
            height={48}
          />
          
          <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 bg-[#9012FD] p-2"
            src="https://res.cloudinary.com/the-great-sync/image/upload/v1690485091/Misx/codenwbie_ow6ugn.png"
            alt="Code Newbie logo"
            width={158}
            height={48}
          />  

                    
        <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://res.cloudinary.com/the-great-sync/image/upload/v1690485179/Misx/DEV_lcbg2p.png"
            alt="DEV.TO logo"
            width={158}
            height={48}
          />

        </div>
        <Image 
          alt=""
          src="https://res.cloudinary.com/the-great-sync/image/upload/v1690484946/Misx/Screen_Shot_2021-12-27_at_5.28.08_PM_lfbdty.png"
          width={3816}
          height={1602}
        />
      </div>

    </article>


      </div>
    </div>
  )
}
