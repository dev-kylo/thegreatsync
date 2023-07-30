
import AllChapters from "@/components/chapterOne";
import Credibility from "@/components/credibility";
import Faqs from "@/components/faqs";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Intro from "@/components/intro";
import Mnemonics from "@/components/mnemonics";
import Model from "@/components/model";
import Model2 from "@/components/model2";
import Price from "@/components/price";
import PriceBottom from "@/components/priceBottom";
import Quote from "@/components/quote";
import SingleQuote from "@/components/singleQuote";
import SingleQuote2 from "@/components/singleQuote2";
import SingleQuote3 from "@/components/singleQuote3";
import TheProblem from "@/components/theproblem";
import TwoTestimonials from "@/components/twoTestimonials";
import Vision from "@/components/vision";
import WhoAmI from "@/components/whoami";


export default function Home() {

  return (
    <main className="">
        <Hero />
        <Intro />
        <SingleQuote />
        <TheProblem />
        <Quote />
        <Vision />
        <WhoAmI />
        <Credibility />
        <Model2 />
        <SingleQuote2 />
        <Mnemonics />
        <AllChapters />
        <TwoTestimonials />
        <Price />
        <Faqs />
        <SingleQuote3 />
        <PriceBottom />
        <Footer />
        

    </main>
  )
}
