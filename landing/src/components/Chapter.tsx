import { ChapterScreen } from "./chapterScreen"


type ChapterProps = {
    posts: {title: string, imageUrl: string, id: string| number}[],
    title: string,
    description: string
}

export default function Chapter({posts, title, description} : ChapterProps) {
    return (
      <div className="bg-white py-12 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              {description}
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
               <ChapterScreen title={post.title} id={post.id} imageUrl={post.imageUrl} key={post.id} />
            ))}
          </div>
        </div>
      </div>
    )
  }

