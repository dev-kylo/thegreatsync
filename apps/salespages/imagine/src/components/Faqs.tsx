import { Button } from "./Button"

const faqs = [
  {
    id: 1,
    question: "Is it self-paced?",
    answer:
      "Yes, it is designed to be taken on the side of a full time job, at your own space. ",
  },
  {
    id: 2,
    question: "How long will it take me to complete it?",
    answer:
      "+-30 days part time (1-2 hours per day). If you want to apply the concepts to your own projects (as you should), it will take longer. ",
  },
  {
    id: 3,
    question: "Is this course aimed at beginners or intermediates?",
    answer:
      "For beginners and intermediates, but not for complete beginners who have never seen JavaScript. It is meant to help you 'level up' your skills, not to learn from scratch.",
  },
  {
      id: 4,
      question: "What if I am an absolute beginner?",
      answer:
        "This course will still be super valuable to you, but not as your ONLY resource. Use things like Codecademy and freeCodeCamp, and cross reference what you learn with The Great Sync. ",
    },
    {
      id: 5,
      question: "Do I only look at pictures or do I do any coding?",
      answer:
        "The Great Sync is not a shortcut. It's an effective learning method, but nothing beats the hours you put in behind the code editor. You can't learn JavaScript by looking at pictures. I provide code exercises throughout, and every section has a 'Mental Model Applied' section. But it is up to you to practice recognizing and applying the patterns in your own projects.",
    },
    {
      id: 6,
      question: "Can I get a refund?",
      answer:
        "As I am offering this course for a limited time at a highly reduced price, I am not offering refunds. As long as you commit to the course with an open mind, you won't be disappointed. ",
    },
    {
      id: 7,
      question: "Is this course for me?",
      answer:
        "If you find yourself copy pasting a lot of code and relying on AI, and you enjoy learning visually, this course is 100% for you! ",
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
        <div className="my-8 flex justify-center mx-4">
          <Button href="#pricing-title" className="w-full max-w-64 text-base py-2 bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium rounded-xl">
                Buy the course
          </Button>
        </div>
      </div>
    )
  }
  