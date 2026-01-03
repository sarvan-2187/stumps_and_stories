import Image from "next/image";
import React from "react";

const images = [
    "https://ik.imagekit.io/sarvan/assets_cricket/1.jpg",
    "https://ik.imagekit.io/sarvan/assets_cricket/2.jpg",
    "https://ik.imagekit.io/sarvan/assets_cricket/3.jpg",
    "https://ik.imagekit.io/sarvan/assets_cricket/4.jpg",
    "https://ik.imagekit.io/sarvan/assets_cricket/5.jpg",
    "https://ik.imagekit.io/sarvan/ilt20.png",
];

const Gallery = () => {
    return (
        <section className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-16 py-12 space-y-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center">
                Topics Covered
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className="relative h-56 sm:h-64 border border-cyan-800/50 rounded-md overflow-hidden"
                    >
                        <Image
                            src={src}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
            
            <div className="hidden lg:grid grid-cols-6 grid-rows-4 gap-4 h-[70vh]">
                <div className="relative col-span-2 row-span-3 border border-cyan-800/50 rounded-md overflow-hidden">
                    <Image src={images[0]} alt="IPL" fill className="object-cover" priority />
                </div>

                <div className="relative col-span-2 row-span-2 col-start-1 row-start-4 border border-cyan-800/50 rounded-md overflow-hidden">
                    <Image src={images[1]} alt="WPL" fill className="object-cover" />
                </div>

                <div className="relative col-span-2 row-span-2 col-start-3 row-start-1 border border-cyan-800/50 rounded-md overflow-hidden">
                    <Image src={images[2]} alt="ICC" fill className="object-cover" />
                </div>

                <div className="relative col-span-2 row-span-3 col-start-3 row-start-3 border border-cyan-800/50 rounded-md overflow-hidden">
                    <Image src={images[3]} alt="BBL" fill className="object-cover" />
                </div>

                <div className="relative col-span-2 row-span-3 col-start-5 row-start-1 border border-cyan-800/50 rounded-md overflow-hidden">
                    <Image src={images[4]} alt="SA20" fill className="object-cover" />
                </div>

                <div className="relative col-span-2 row-span-2 col-start-5 row-start-4 border border-cyan-800/50 rounded-md overflow-hidden">
                    <Image src={images[5]} alt="ILT20" fill className="object-cover" />
                </div>
            </div>
        </section>
    );
};

export default Gallery;
