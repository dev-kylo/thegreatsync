const faqs = [
    {
      id: 1,
      question: "Is this course aimed at beginners or intermediates?",
      answer:
        "If you are brand new to JavaScript, or still learning the basic fundamentals for the first time, this course is not for you. It is meant to help anyone 'level up' their skills and not to learn from scratch. If you've started trying to build vanilla JS projects but currently stuck, or you possess basic knowledge and feel ready to advance, this course is perfect for you.",
    },
    {
        id: 2,
        question: "What if I am an absolute beginner?",
        answer:
          " While the first few sections do explain the basics very well for a beginner, and provide a good foundation, the course moves into more advanced topics - to soon for a beginner, who rather spend time practising. Of course, you can purchase the course and use it as a reference, but you may need other resources to help you. ",
      },
      {
        id: 2,
        question: "Do I only look at pictures or do I do any coding?",
        answer:
          "The Great Sync is not a shortcut. It's an effective learning method, but nothing beats the hours you put in behind the code editor. I provide code exercises throughout, and every section has a 'Mental Model Applied' section.",
      },
      {
        id: 5,
        question: "How many projects will I build?",
        answer:
          "Imagine JavaScript is not about building projects. Its focus is on exploring, visualizing and connecting concepts. If you want to focus on building projects, contact Kylo about joining his coaching program: Break Through JavaScript ~ build without a tutorial in 40 days.",
      },

  ]
  
  export default function Faqs() {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-18 sm:py-20 lg:px-8 lg:py-20">
          <h2 className="text-4xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <div key={faq.id} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">{faq.question}</dt>
                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                  <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }
  