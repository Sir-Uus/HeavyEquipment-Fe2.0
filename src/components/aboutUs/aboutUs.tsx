import { useEffect, useState } from "react";

const AboutUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <section
      className={`overflow-hidden pt-28 md:overflow-hidden lg:pt-0 xl:pt-0 fade-in ${
        isLoaded ? "active" : ""
      }`}
    >
      <div className="pr-4 mx-auto sm:pr-6 lg:px-8 max-w-7xl lg:h-screen">
        <div className="lg:grid items-center grid-cols-1 md:grid-cols-2">
          <div className="pl-6">
            <h2 className="text-lg mb-2 md:text-2xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Hey 👋 Good Fams
            </h2>
            <p className="max-w-lg text-[14px] leading-5 md:text-xl text-gray-600 md:mt-8">
              Our platform specializes in providing top-notch heavy equipment rentals and high-quality spare
              parts. We are committed to delivering exceptional service and support to meet your equipment
              needs. Our mission is to ensure you have the best tools and resources for your projects. With a
              focus on reliability and customer satisfaction, we strive to be your trusted partner in the
              industry.
            </p>

            <p className="text-xl text-gray-60 mt-3">
              <span className="relative inline-block">
                <span className="relative text-sm md:text-[20px]"> Have a question? </span>
              </span>
              <br className="block sm:hidden" /> <span className="text-sm md:text-[20px]">Contact us on</span>
            </p>
            <div className="flex gap-4 mt-5">
              <img src="/gmail.png" alt="gmail" className="w-10 cursor-pointer" />
              <img src="/tweet.png" alt="tweet" className="w-10 cursor-pointer" />
              <img src="/whatsapp.png" alt="whatsapp" className="w-10 cursor-pointer" />
            </div>
          </div>

          <div className="relative">
            <img
              className="absolute inset-x-0 bottom-0 -mb-48 -translate-x-1/2 left-1/2 lg:block hidden"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/team/1/blob-shape.svg"
              alt=""
            />

            <img
              className="relative w-full xl:max-w-lg xl:mx-auto 2xl:origin-bottom 2xl:scale-105 lg:block hidden"
              src="/mech-woman.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
