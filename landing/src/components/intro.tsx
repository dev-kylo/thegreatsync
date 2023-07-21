
const posts = [
  {
    id: 1,
    title: 'Build a foundation of visual, memorable concepts.',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.',
    imageUrl:
      'https://res.cloudinary.com/the-great-sync/image/upload/v1682000194/Closure_ahwz9m.jpg',
  },
  {
    id: 2,
    title: 'Apply those concepts in a variety of environments',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.',
    imageUrl:
      'https://res.cloudinary.com/the-great-sync/image/upload/v1689935186/model_xg5f95.png',
  },
  {
    id: 3,
    title: 'Learn The Universal Pattern',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.',
    imageUrl:
      'https://res.cloudinary.com/the-great-sync/image/upload/v1686602909/A-program-execution_gw1mm7.jpg',
  },
]

export default function Intro() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
      
    <article className="prose lg:prose-xl prose-li:my-0">
 
        <div className='flex flex-col items-center mb-10'>
            <span className='text-7xl font-bold tracking-tight '>The Syncer Program</span>
            <span className='mt-4 font-bold'>Level Up With Visual & Memorable JavaScript</span>
        </div>
        <p>Introducing The Great Sync: a complete visual mental model for learning JavaScript concepts and applying them to projects, code challenges, documentation, and any JavaScript you encounter. </p>
        <p> ItI&lsquo;ms designed specifically to help you overcome any barriers and mental blocks about using JavaScript confidently.</p>
        <span className='text-xl font-bold tracking-tight mb-0 pb-0 '>Does any of this sound like YOU?</span>
        <ul className=''>
          <li className='my-0 py-0'>I felt confident after HTML & CSS. And then JavaScript made me miserable.</li>
          <li>II&lsquo;mve used JS for months, even years, and I STILL blindly copy-paste. </li>
          <li>I know some of the fundamentals. I canI&lsquo;mt build anything.</li>
          <li>I am so frustrated with it.</li>
          <li>I am afraid I will never get the hang of it. Maybe this isnI&lsquo;mt for me...</li>
          <li> Maybe this isnI&lsquo;mt for me...</li>
        </ul>
        <span className='text-xl font-bold tracking-tight mb-0 pb-0 '> That last one is <strong>HAUNTING</strong>.</span>
        <p> Maybe this isnI&lsquo;mt for me.... When I hear those words, it truly makes me sad. Because you CAN do it.</p>

        <ul role="list" className="mt-8  text-gray-600">
            <li className="">
 
              <span >
                <strong className="font-semibold text-gray-900 ">Even if...</strong> you never studied computer science.
              </span>
            </li>
            <li className="">
 
              <span>
                <strong className="font-semibold text-gray-900">Even if...</strong> you are career transitioning and only have limited time to code.
              </span>
            </li>
            <li className="">
 
              <span>
                <strong className="font-semibold text-gray-900">Even if....</strong> you have been learning for months and canI&lsquo;mt build a basic program.
              </span>
            </li>            <li className="">
 
              <span>
                <strong className="font-semibold text-gray-900">Even if....</strong> youI&lsquo;mre that person who always has computer issues. And yet you want to be a developer.
              </span>
            </li>
          </ul>
 

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="relative flex flex-col gap-8 lg:flex-row">
                <div className="relative lg:w-64 h-48 md:h-40 lg:shrink-0">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full  rounded-2xl bg-gray-50 object-cover"
                  />
           
                </div>
                <div>
                  <div className="group relative max-w-xl mt-8">
                    <span className=" text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        {post.title}
                    </span>
                    <p className="mt-5 text-sm leading-6 text-gray-600">{post.description}</p>
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
