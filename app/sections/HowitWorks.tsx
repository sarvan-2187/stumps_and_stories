import { CardSpotlight } from "@/components/ui/card-spotlight";

const steps1 = [
    "Enter your email address",
    "Click on submit",
    "Instantly recieve confirmation mail",
];

export function HowitWorks() {
    return (
        <section className="min-h-[70vh] w-full px-4 sm:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center pb-12">
                How it Works
            </h2>
            <div className="flex gap-6 place-items-center justify-center">
                    <CardSpotlight
                        className="w-full max-w-sm min-h-[20rem]"
                    >
                        <p className="text-xl font-bold relative z-20 mt-2 text-white">
                            Just Submit your Email Address
                        </p>

                        <div className="text-neutral-200 mt-4 relative z-20">
                            Follow these steps to subscribe:
                            <ul className="list-none mt-3 space-y-2">
                                {steps1.map((step, idx) => (
                                    <Step key={idx} title={step} />
                                ))}
                            </ul>
                        </div>

                        <p className="text-neutral-300 mt-4 relative z-20 text-sm">
                            And that's pretty much you need to do to get updates from the cricket world weekly twice...
                        </p>
                </CardSpotlight>
            </div>
        </section>
    );
}

const Step = ({ title }: { title: string }) => {
    return (
        <li className="flex gap-2 items-start">
            <CheckIcon />
            <p className="text-white text-sm leading-relaxed">{title}</p>
        </li>
    );
};

const CheckIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-blue-500 mt-1 shrink-0"
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.59 7.41-4 4a1 1 0 0 1-1.41 0l-2-2a1 1 0 1 1 1.41-1.41l1.29 1.3 3.3-3.3a1 1 0 1 1 1.41 1.41z" />
        </svg>
    );
};
