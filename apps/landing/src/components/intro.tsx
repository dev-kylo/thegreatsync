import Image from "next/image"

const posts = [
  {
    id: 1,
    title: 'Build a foundation of visual, memorable concepts.',
    description:
      'Every concept will have a visual, mnemonic image that represents it. They will build on top of another until we can see a full picture of how a concept works.  ',
    imageUrl:
      'https://res.cloudinary.com/the-great-sync/image/upload/v1682000194/Closure_ahwz9m.jpg',
  },
  {
    id: 2,
    title: 'Apply every concept',
    description:
      'Practise writing, reading and even drawing code while referring back to the visuals. Build a mental model.',
    imageUrl:
      'https://res.cloudinary.com/the-great-sync/image/upload/v1689935186/model_xg5f95.png',
  },
  {
    id: 3,
    title: 'Learn The Universal Pattern',
    description:
      'All the visual models and concepts combine into a blueprint that can be applied to building any project or application from scratch.',
    imageUrl:
      'https://res.cloudinary.com/the-great-sync/image/upload/v1686602909/A-program-execution_gw1mm7.jpg',
  },
]



export default function Intro() {
  return (
    <div className="bg-white px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
      
    <article className="prose lg:prose-xl prose-li:my-0 prose-headings:text-gray-700 prose-headings:mt-8">
      <p className="text-2xl font-semibold leading-8 tracking-tight text-primary_blue">Introducing...</p>
        <div className='flex flex-col items-center mb-10'>
            <span className='text-7xl font-bold tracking-tight '>The Syncer Program</span>
            <span className='mt-4 font-bold'>Level Up With Visual & Memorable JavaScript</span>
        </div>
        <p className="mt-6 text-xl leading-8 text-gray-700">The Great Sync is a complete visual mental model for learning JavaScript concepts and applying them to projects, code challenges, documentation, and any JavaScript you encounter. </p>
        <p className="mt-6 text-xl leading-8 text-gray-700"> It&lsquo;s designed specifically to help you overcome any barriers and mental blocks about using JavaScript confidently.</p>
        <span className='text-2xl font-bold tracking-tight mb-0 pb-0 '>Does any of this sound like YOU?</span>
        <ul className=''>
          <li className="mt-6 text-xl leading-8 text-gray-700">I felt confident after HTML & CSS. And then JavaScript made me miserable.</li>
          <li className="mt-6 text-xl leading-8 text-gray-700">I&lsquo;ve used JS for months, even years, and I STILL blindly copy-paste. </li>
          <li className="mt-6 text-xl leading-8 text-gray-700">I know some of the fundamentals. I can&lsquo;t build anything.</li>
          <li className="mt-6 text-xl leading-8 text-gray-700">I&lsquo;m stuck. Maybe this isn&lsquo;t for me...</li>
        </ul>
        <span className='text-xl font-bold tracking-tight mb-0 pb-0 '> That last one is <strong>HAUNTING</strong>.</span>
        <p className="mt-6 text-xl leading-8 text-gray-700  mb-0"> When I hear those words, it truly makes me sad. Because you CAN do it.</p>


        <ul role="list" className="mt-6 text-gray-600">
            <li className="mt-6 text-xl leading-8 text-gray-700">
 
              <span >
                <strong className="font-semibold text-gray-900 w-10">Even if...</strong> you struggle to code without a tutorial.
              </span>
            </li>
            <li className="mt-6 text-xl leading-8 text-gray-700">
 
              <span>
                <strong className="font-semibold text-gray-900 w-10">Even if...</strong> you are career transitioning and only have limited time to code.
              </span>
            </li>
            <li className="mt-6 text-xl leading-8 text-gray-700">
 
              <span>
                <strong className="font-semibold text-gray-900 w-10">Even if....</strong> you have been completely stuck for months.
              </span>
            </li>            
          </ul>
 
      <h2 className="pt-12"> The Syncer Program&lsquo;s novel approach to learning</h2>
      <p className="text-xl leading-8 text-gray-600"> This is a systematic learning program with a clearly defined goal: 
      learn the patterns, and the fundamentals in those patterns, that build applications. </p>
      <p className="text-xl leading-8 text-gray-600"> There are 3 main steps: </p>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="relative flex flex-col gap-8 lg:flex-row">
                <div className="relative lg:w-64 h-44 md:h-40 lg:shrink-0">
                  <Image
                      src={post.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full  rounded-2xl bg-gray-50 object-cover"
                      width={400}
                      height={300}
                  />
               
           
                </div>
                <div>
                  <div className="group relative max-w-xl mt-8">
                    <span className=" text-xl font-semibold leading-6 text-gray-900 ">
                        {post.title}
                    </span>
                    <p className="mt-3 text-md leading-6 text-gray-600">{post.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>




    </article>


      </div>
    </div>
  )
}
