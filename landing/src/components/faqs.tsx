const faqs = [
    {
      id: 1,
      question: "Is this course aimed at beginners or intermediates?",
      answer:
        "The Syncer Program is designed with one aim in mind: to help you gain the confidence and fundamental knowledge to build projects at a high standard. Whether you've started trying to build vanilla JS projects but currently stuck, or you possess basic knowledge and feel ready to advance, this course is perfect for you. Much of it focuses on 'senior-level' best practices. That means you need some familiarity with JavaScript already.",
    },
    {
        id: 2,
        question: "What if I am an absolute beginner?",
        answer:
          "As the name suggests, the course is meant to help anyone 'level up' their skills. and not to learn from scratch. While the first part does explain the basics very well for a beginner, the focus shifts to applying those concepts at a good standard. Your first aim as an absolute beginner should be fluency, not writing good maintable code. Later this year there will a coaching opportunity specifically for absolute beginners, be sure to look out for that. ",
      },
      {
        id: 2,
        question: "Do I only look at pictures or do I do any coding?",
        answer:
          "The Great Sync is not a shortcut. It's an effective learning method, but nothing beats the hours you put in behind the code editor. I provide code exercises throughout, and every section has a 'Mental Model Applied' section.",
      },
      {
        id: 5,
        question: "Can I get a refund?",
        answer:
          "I offer a 30 Day Money-Back Guarantee, on the condition that you prove to me that you put effort in and did the exercises. ",
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
  