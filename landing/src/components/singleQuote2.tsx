export default function SingleQuote2() {
    return (
      <section className="relative isolate overflow-hidden bg-primary_blue px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p className="text-white">
                “This really helped me to understand some advanced JavaScript concepts! 
                I am a visual learner so I love to see illustrations. 
                The fact that they are unique is even better because it is more memorable! I loved how everything was explained (in detail) and that there were example coding challenges which were then run through line by line with illustrations to understand how it all worked and to see the big picture come together.
                 I loved the use of analogies and acronyms again reinforcing the learning. Amazing skilled teaching,”
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                className="mx-auto h-28 w-28 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-white"> Student</div>
                <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-white">Anonymous</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }