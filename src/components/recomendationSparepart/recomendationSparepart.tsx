import { Button, Card, CardMedia, Skeleton } from "@mui/material";
import { useState } from "react";
import { useSparePart } from "../../hooks/sparepartHooks/useSparepart";
import { formatNumber, getAverageRatingSparepart } from "../../utils";
import { Link } from "react-router-dom";

const recomendationSparepart = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;

  const { sparePart, sparePartImage } = useSparePart();
  const handleNext = () => {
    if (currentIndex + cardsPerView < sparePart.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <div className="m-3 md:m-10 mt-20">
        <div className="md:m-10 mt-20 flex justify-between">
          <div>
            <span className="text-[8px] md:text-xl font-semibold">Recomendation Sparepart</span>
          </div>
          <div className="flex gap-3">
            <Link to="/parts">
              <Button variant="outlined" style={{ color: "#000", borderColor: "#facc15" }}>
                <span className="text-[8px] md:text-[12px] xl:text-[15px]">See More</span>
              </Button>
            </Link>
            <Button
              variant="contained"
              style={{ color: "#000", backgroundColor: "#facc15" }}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-1 h-[25px] xl:h-[36px]"
            >
              <span className="material-icons text-[8px]">arrow_back_ios_new</span>
            </Button>
            <Button
              variant="contained"
              style={{ color: "#000", backgroundColor: "#facc15" }}
              onClick={handleNext}
              disabled={currentIndex + cardsPerView >= sparePart.length}
              className="w-1 h-[25px] xl:h-[36px]"
            >
              <span className="material-icons text-[8px]">arrow_forward_ios</span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden mx-4 mt-5">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {sparePart.map((sparePart) => (
              <Card
                key={sparePart.id}
                sx={{
                  // width: "32%",
                  flexShrink: 0,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
                className="w-[29%] md:w-[32%]"
              >
                <Link to={`/equipment/details/${sparePart.id}`}>
                  <div className="flex justify-center">
                    {sparePartImage?.[sparePart.id] ? (
                      <CardMedia
                        component="img"
                        image={sparePartImage[sparePart.id]}
                        alt={`sparePart-${sparePart.id}`}
                        style={{
                          margin: 16,
                        }}
                        className=" w-[190px] h-[70px] md:w-[230px] md:h-[180px] xl:w-[250px] xl:h-[230px] object-cover"
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          margin: 2,
                          width: { xs: 190, sm: 230, xl: 250 },
                          height: { xs: 70, sm: 180, xl: 230 },
                        }}
                      />
                    )}
                  </div>
                </Link>
                <div className="border-t border-gray-300">
                  <div className="text-[8px] md:text-[12px] m-2 mt-4">
                    <span className="px-1 md:px-3">{formatNumber(sparePart?.price)}</span>
                  </div>
                  <div className="m-4 flex justify-between">
                    <div className="flex gap-2">
                      <span className="material-icons text-yellow-400 text-[8px] md:text-[12px] md:mt-[3px]">
                        comment
                      </span>
                      <span className="text-[5px] md:text-[12px]">
                        {sparePart?.sparePartFeedbacks?.length}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[5px] md:text-[12px]">
                        {getAverageRatingSparepart(sparePart?.sparePartFeedbacks)}
                      </span>
                      <span className="material-icons text-yellow-400 text-[8px] md:text-[12px] md:mt-[3px]">
                        star
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default recomendationSparepart;
