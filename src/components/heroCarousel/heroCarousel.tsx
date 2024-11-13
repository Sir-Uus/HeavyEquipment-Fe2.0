import { useEffect, useState } from "react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: "/bulldozer_ads.jpg" },
    { id: 2, image: "/excavator_ads.jpg" },
    { id: 3, image: "/secured_payment_ads.jpg" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-32 md:h-40 md:mx-[140px] md:max-w-4xl xl:w-full xl:mx-auto xl:h-64 mx-10 overflow-hidden rounded-lg shadow-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="md:w-full flex-shrink-0 w-[304px] h-[130px] md:h-[160px] xl:h-[260px] bg-gray-200 flex items-center justify-center text-2xl font-bold"
          >
            <img src={slide.image} alt={`Slide ${slide.id}`} className="w-full h-full object-fill" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
              index === currentSlide ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
