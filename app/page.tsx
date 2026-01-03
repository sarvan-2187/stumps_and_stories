import Image from "next/image";
import Hero from "./sections/Hero";

export default function Home() {
  return (
    <div className="bg-black text-white px-8 md:px-24">
      <div className="py-70 md:py-8">
        <Hero/>
      </div>
      
    </div>
  );
}
