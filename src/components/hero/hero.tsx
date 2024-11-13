import { useEffect, useState } from "react";
import hero_img from "/dump_truck.png";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsVisible(true);
  }, []);

  return (
    <div className="h-[340px] md:h-[500px] xl:h-screen flex relative overflow-hidden md:pt-[20px]">
      <div
        className={`flex-1 flex flex-col gap-5 pl-8 pr-10 pt-[120px] leading-tight z-10 transform transition-transform duration-1000 ease-in-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-md md:text-xl xl:text-3xl font-bold">POWERFUL EQUIPMENT</h2>
        <p className="text-[12px] md:text-sm xl:text-[18px] xl:leading-7 font-light text-gray-900">
          Welcome to our website for heavy equipment rentals and spare parts purchases. We offer a wide range
          of rental equipment and high-quality spare parts for your needs. Find optimal solutions and the
          support for your projects with us.
        </p>
        <div className="mt-2 md:mt-8  ">
          {isAuthenticated ? (
            <Link to="/equipment">
              <button className="flex justify-center items-center text-[9px] gap-1 p-2 w-36 md:text-[13px] xl:text-[15px] md:gap-4 md:py-3 md:w-56 rounded-full bg-yellow-400 text-gray-900 duration-600 ease-in hover:bg-yellow-300 hover:text-gray-950 transition-transform transform hover:scale-105">
                Browse Equipment{" "}
                <span className="material-icons text-[9px] md:text-[15px]">arrow_right_alt</span>
              </button>
            </Link>
          ) : (
            <Link to="/register">
              <button className="flex justify-center items-center text-[12px] gap-1 p-2 w-28 md:text-[13px] xl:text-[15px] md:gap-4 md:py-3 md:w-56 rounded-full bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950">
                Register
              </button>
            </Link>
          )}
        </div>
      </div>
      <div
        className={`flex-2 flex items-center justify-center transform transition-transform duration-1000 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <img
          src={hero_img}
          alt="Dump Truck"
          className="hidden md:flex md:w-[360px] xl:w-[600px] lg:w-[500px] mr-10 mt-[120px] z-10 relative"
        />
        <img
          src="/segi_lima2.png"
          alt="Pentagon"
          className="hidden md:flex absolute right-[-100px] xl:right-[-200px] bottom-90 w-[880px] h-[1000px] z-0"
        />
      </div>
    </div>
  );
};

export default Hero;
