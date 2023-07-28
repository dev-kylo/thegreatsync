

export function ChapterScreen ({imageUrl, title, id}: {imageUrl: string, title: string, id: string|number}) {
return (
  <article key={id} className="flex flex-col items-start justify-between">
  <div className="relative w-full">
    
    <img
      src={imageUrl}
      alt=""
      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
    />
    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
  </div>
    <div className="group relative">
      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">

          <span className="absolute inset-0" />
          {title}

      </h3>

    </div>
 
</article>
)
}