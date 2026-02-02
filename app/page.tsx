import Image from "next/image";
import Hero from "./sections/Hero";
import Gallery from "./sections/Gallery";
import Footer from "./sections/Footer";
import { HowitWorks } from "./sections/HowitWorks";

export default function Home() {
  return (
    <div className="bg-black text-white px-4 md:px-24">
      <div className="py-70 md:py-8">
        <Hero/>
      </div>
      <Gallery />
      <HowitWorks/>
      <Footer/>
    </div>
  );
}
