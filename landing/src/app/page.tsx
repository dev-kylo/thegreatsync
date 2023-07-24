
import Credibility from "@/components/credibility";
import Faqs from "@/components/faqs";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Intro from "@/components/intro";
import Model from "@/components/model";
import Price from "@/components/price";
import SingleQuote from "@/components/singleQuote";
import SingleQuote2 from "@/components/singleQuote2";
import Vision from "@/components/vision";
import WhoAmI from "@/components/whoami";


export default function Home() {

  return (
    <main className="">
        <Hero />
        <Intro />
        <SingleQuote />
        <Vision />
        <WhoAmI />
        <Credibility />
        <Model/>
        <SingleQuote2 />
        <Price />
        <Faqs />
        <Footer />
        

    </main>
  )
}
