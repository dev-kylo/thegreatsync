import Chapter from "./Chapter"
import { ChapterScreen } from "./chapterScreen"

const chapterone = [
    {
        id: 1,
        title: 'How should you learn JavaScript?',
        imageUrl:
          'https://res.cloudinary.com/the-great-sync/image/upload/v1690486755/Misx/Screen_Shot_2023-07-27_at_11.38.46_PM_lhfzrv.png',

      },
    {
        id: 2,
        title: 'Spot the Imp',
        imageUrl:
          'https://res.cloudinary.com/the-great-sync/image/upload/v1690486823/Misx/Screen_Shot_2023-07-27_at_11.40.03_PM_cyr7ej.png',

      },
      {
        id: 3,
        title: 'Mnemonics & Imagimodels',
        imageUrl:
          'https://res.cloudinary.com/the-great-sync/image/upload/v1690486888/Misx/Screen_Shot_2023-07-27_at_11.41.13_PM_c1z2em.png',
      },
 
  ]

  const stepIntoFlow = [
    {
      id: 11,
      title: 'What are the Primitives?',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690540112/Screen_Shot_2023-07-28_at_2.28.11_PM_iagwq6.png',
    },
    {
      id: 22,
      title: 'If/Else statements visualized',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690540948/Screen_Shot_2023-07-28_at_2.42.08_PM_toelqm.png',
    },
    {
      id: 33,
      title: 'Grouped expressions',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690714507/Screen_Shot_2023-07-30_at_2.53.39_PM_p05t3j.png',
    },
    {
      id: 11,
      title: 'Postfix and Prefix operations',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690714755/Screen_Shot_2023-07-30_at_2.56.51_PM_fpc6th.png',
    },
    {
      id: 22,
      title: 'Write the logic for a game',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690714815/Screen_Shot_2023-07-30_at_3.00.04_PM_jvdthl.png',
    },
    {
      id: 33,
      title: 'Write expressions like a senior',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690541061/Screen_Shot_2023-07-28_at_2.44.06_PM_hulxdz.png',
    },
  ]

  const constructables = [
    {
      id: 111,
      title: 'What are the Constructables?',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690541151/Screen_Shot_2023-07-28_at_2.45.41_PM_ory7n3.png',
    },
    {
      id: 222,
      title: 'Cloning explained visually',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690541238/Screen_Shot_2023-07-28_at_2.47.03_PM_mtx2ml.png',
    },
    {
      id: 222,
      title: 'A pattern for all loops',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690714985/Screen_Shot_2023-07-30_at_3.02.14_PM_uxgmtj.png',
    },
    {
      id: 333,
      title: 'The problem inheritance solves',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690715346/Screen_Shot_2023-07-30_at_3.08.54_PM_jb4huj.png',
    },
    {
      id: 333,
      title: 'Function pattern identification in React Js',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690541405/Screen_Shot_2023-07-28_at_2.49.40_PM_nt47x4.png',
    },
    {
      id: 333,
      title: 'The Creation Phase of execution contects',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690715478/Screen_Shot_2023-07-30_at_3.10.34_PM_n7bysr.png',
    },
  ]

  const universalPattern = [
    {
      id: 1111,
      title: 'The Universal Pattern visualized',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690542449/Screen_Shot_2023-07-28_at_3.07.11_PM_y6jca1.png',
    },
    {
      id: 2222,
      title: 'How the DOM fits in with JavaScript',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690135230/3000x2000/APIs-cc_c5pov3.jpg',
    },
    {
      id: 3333,
      title: 'Junior vs senior functions',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690715801/Screen_Shot_2023-07-30_at_3.16.26_PM_wsse11.png',
    },
    {
      id: 1111,
      title: 'Recognizing the pattern in other apps',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690715801/Screen_Shot_2023-07-30_at_3.16.26_PM_wsse11.png',
    },
    {
      id: 2222,
      title: 'What a closure really looks like',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690715966/Screen_Shot_2023-07-30_at_3.19.05_PM_erh2cq.png',
    },
    {
      id: 3333,
      title: 'How to build any application',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690542618/Screen_Shot_2023-07-28_at_3.09.48_PM_u075iw.png',
    },
  ]




  const asyncAwait = [
    {
      id: 11111,
      title: 'An Async Imagimodel',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690137406/2000x2000/EventLoop_jipylo.jpg',
    },
    {
      id: 22222,
      title: 'Promises',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690539982/alienspaceship-ring_2_szephi.png',
    },
    {
      id: 33333,
      title: 'Macro and Micro Queues',
      imageUrl:
        'https://res.cloudinary.com/the-great-sync/image/upload/v1690539838/genies_gznniu.jpg',
    },
  ]



  
  export default function AllChapters() {
    return (
      <>
        <h2 className="mt-16 md:mt-24 text-4xl text-center font-bold tracking-tight text-gray-900 sm:text-6xl">The Course Sections</h2>
        <Chapter posts={chapterone} title="How to learn JavaScript" description="Learning strategy is key to not feeling lost and directionless. In this section we look at how to optimize your learning, and when memory techniques should and should not be used." />
        <Chapter posts={stepIntoFlow} title="Step into the flow of a JavaScript program" description="We begin understanding what makes a program run, and how we pass data around it. By the end of this chapter, you are writing clean, readable conditional flow for a gaming app where a player can move around a grid using a keyboard." />
        <Chapter posts={constructables} title="A deep dive into objects and functions" description="Using visual imagimodels, we deconstruct objects, arrays and functions and learn what their role is in an application. We then apply this knowledge to loops, prototypal inheritance, composition and even a complete visualization of a call stack. You will need to sketch code, fix beginner code, complete short exercises, and read library source code.   " />
        <Chapter posts={universalPattern} title="Learn the Universal Pattern for apps" description="Using all the visual layers we have built up in previous sections, we paint a picture of what an application looks like. We learn this pattern, and then start applying it! We begin by reading other people's code and identifying it. Then we practice developing with it, using a blueprint that can be applied to building anything!" />
        <Chapter posts={asyncAwait} title="Exploring async - [ SEPTEMBER ]" description="This section will only be released in September. We use visual models to explain asynchronous functions, promises and async/await. We adapt The Universal Pattern for handling async events." />
      </>
    )
  }
  