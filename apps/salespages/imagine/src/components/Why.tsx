/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import modelImage from '@/images/model-diagram.jpg'
import { HighlightedText } from "./HighlightedText";


const Why = () => {
    return (
        <section
        id="why"
        aria-labelledby="resources-title"
        className=" sm:py-20 mt-4 lg:pt-4 grid  md:grid-cols-2 gap-2 max-w-7xl mx-auto"
      >
        <Container>
          <SectionHeading number="3" id="resources-title">
            Your Why
          </SectionHeading>
          <p className="mt-8 text-lg tracking-tight text-slate-700 font-bold">What would it feel like if you felt confident about your fundamentals?</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">Let‘s imagine what being a <HighlightedText>professional JavaScript developer </HighlightedText>CAN and SHOULD look like.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">You arrive at the office at 9am. You look forward to seeing your colleagues - all experts in their fields, from designers to dev ops.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">You‘re a specialist too, and play an important role in the team.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">You sit at your desk, and begin planning the day‘s work. You‘re quite new in the job, but already they need you to urgently fix a bug in the application.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">This is the first time you‘re seeing the code. You smile and remember a time this would cause panic and stress.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">Now, it‘s just a challenge - a satisfying exercise to fix something with the knowledge you have. <HighlightedText>It‘s only plain JavaScript.</HighlightedText> </p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">It‘s the same patterns you used to learn the latest framework quickly.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">And the same patterns you used the night before in your side project - a vanilla JS app you can‘t wait to get back to.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700">Only a deep appreciation and understanding of the fundamentals give you the power to recognize these patterns.</p>
          <p className="mt-4 text-lg tracking-tight text-slate-700"><HighlightedText color="blue">It‘s what sets you apart.</HighlightedText></p>

        </Container>
        <div className="max-w-sm md:max-w-lg items-center justify-center pt-4 md:pt-24 ">
            <Image
                alt=""
                src={modelImage}
                width={1300}
                height={1500}
                className="my-8"
            />
        </div>
    
        </section>
    )
}

export default Why;