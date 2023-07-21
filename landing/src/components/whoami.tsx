export default function WhoAmI() {
    return (
      <section className="isolate overflow-hidden bg-white px-6 lg:px-8">
        <div className="relative mx-auto max-w-2xl py-12 sm:py-24 lg:max-w-4xl">
          <div className="absolute left-1/2 top-0 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,theme(colors.indigo.100),white)] opacity-20 lg:left-36" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center" />
          <figure className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-10">
            <div className="relative col-span-2 lg:col-start-1 lg:row-start-2">
              <blockquote className="text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
    
                <p>
                  Commodo amet fugiat excepteur sunt qui ea elit cupidatat ullamco consectetur ipsum elit consequat. Elit
                  sunt proident ea nulla ad nulla dolore ad pariatur tempor non. Sint veniam minim et ea.
                </p>
              </blockquote>
            </div>
            <div className="col-end-1 w-72 lg:row-span-4 lg:w-[30rem]">
              <img
                className="rounded-xl bg-indigo-50 lg:rounded-3xl"
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1689926354/Kylo_mr2yts.jpg"
                alt=""
              />
            </div>
            <figcaption className="text-base lg:col-start-1 lg:row-start-3 hidden lg:block">
              <div className="font-semibold text-gray-900">Kylo</div>
              <div className="mt-1 text-gray-500">Senior Javascript Developer</div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }
  