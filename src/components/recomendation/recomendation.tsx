import { useState } from "react";
import { Button, Card, CardMedia, Skeleton } from "@mui/material";
import { useEquipments } from "../../hooks/equipmentHooks/useEquipment";
import { formatNumber, getAverageRating } from "../../utils";
import { Link } from "react-router-dom";

const Recomendation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;

  const { equipments, equipmentImages } = useEquipments();

  const handleNext = () => {
    if (currentIndex + cardsPerView < equipments.length) {
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
            <span className="text-[8px] md:text-xl font-semibold">Recomendation Equipment</span>
          </div>
          <div className="flex gap-3">
            <Link to="/equipment">
              <Button variant="outlined" style={{ color: "#000", borderColor: "#facc15" }}>
                <span className="text-[8px] md:text-[12px] xl:text-[15px]">See More</span>
              </Button>
            </Link>
            <div className="flex gap-2">
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
                disabled={currentIndex + cardsPerView >= equipments.length}
                className="w-1 h-[25px] xl:h-[36px]"
              >
                <span className="material-icons text-[8px]">arrow_forward_ios</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mx-4 mt-5">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {equipments.map((equipment) => (
              <Card
                key={equipment.id}
                sx={{
                  flexShrink: 0,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
                className="w-[29%] md:w-[32%]"
              >
                <Link to={`/equipment/details/${equipment.id}`}>
                  <div className="flex justify-center">
                    {equipmentImages?.[equipment.id] ? (
                      <CardMedia
                        component="img"
                        image={equipmentImages[equipment.id] || ""}
                        alt={`equipment-${equipment.id}`}
                        style={{
                          margin: 16,
                          objectFit: "cover",
                        }}
                        className="w-[190px] h-[70px] md:w-[230px] md:h-[180px] xl:w-[250px] xl:h-[230px]"
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
                  <div className="border-t border-gray-300">
                    <div className="flex justify-between text-[8px] md:text-[14px] m-1 mt-4">
                      <span className="px-1 md:px-3">{equipment?.name}</span>
                      <span className="px-1 md:px-3">{formatNumber(equipment?.rentalPrice)}</span>
                    </div>
                    <div className="m-4 flex justify-between">
                      <div className="flex gap-2">
                        <span className="material-icons text-yellow-400 text-[8px] md:text-[14px] md:mt-[3px] ">
                          comment
                        </span>
                        <span className="text-[8px] md:text-[14px]">
                          {equipment?.performanceFeedbacks?.length}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[8px] md:text-[14px]">
                          {getAverageRating(equipment?.performanceFeedbacks)}
                        </span>
                        <span className="material-icons text-yellow-400 text-[8px] md:text-[14px] md:mt-[3px] ">
                          star
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recomendation;