
import Hero from "@/components/hero";
import Intro from "@/components/intro";
import Model from "@/components/model";
import Price from "@/components/price";
import SingleQuote from "@/components/singleQuote";
import { useEffect } from "react";

export default function Home() {

  return (
    <main className="">
        <Hero />
        <Intro />
        <SingleQuote />
        <Model/>
        <Price />
    </main>
  )
}
