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
        title: 'How to remember what you learn',
        imageUrl:
          'https://res.cloudinary.com/the-great-sync/image/upload/v1690486888/Misx/Screen_Shot_2023-07-27_at_11.41.13_PM_c1z2em.png',
      },
 
  ]



  
  export default function AllChapters() {
    return (
      <>
      <Chapter posts={chapterone} title="How to learn JavaScript" description="We focus on learning methods, and how to recall informatio" />
      <Chapter posts={chapterone} title="Step into the flow of a JavaScript program" description="We focus on learning methods, and how to recall informatio" />
      <Chapter posts={chapterone} title="A deep dive into objects and functions" description="We focus on learning methods, and how to recall informatio" />
      <Chapter posts={chapterone} title="Learn the Universal Pattern for apps" description="We focus on learning methods, and how to recall informatio" />
      <Chapter posts={chapterone} title="Exploring async" description="We focus on learning methods, and how to recall informatio" />
      </>
    )
  }
  