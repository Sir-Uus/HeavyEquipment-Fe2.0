import { Card, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";

const cardHero = () => {
  const cardsData = [
    { image: "/card-1.jpg", alt: "card-1", text: "Search Equipment", link: "/equipment" },
    { image: "/card_2.jpg", alt: "card-2", text: "Search Sparepart", link: "/parts" },
    { image: "/card-3.jpg", alt: "card-3", text: "About Us", link: "/about-us" },
    { image: "/card-4.jpg", alt: "card-4", text: "Transaction", link: "/transaction-history" },
  ];

  return (
    <div className="m-10 mt-14 mb-14">
      <div className="flex gap-2 justify-center md:gap-4">
        {cardsData.map((card, index) => (
          <Link to={card.link} key={index} style={{ textDecoration: "none" }}>
            <Card
              key={index}
              variant="elevation"
              className="p-2 cursor-pointer w-[70px] hover:scale-105 h-[105px] md:w-[110px] md:h-[150px] md:p-4"
            >
              <CardMedia
                component="img"
                image={card.image}
                alt={card.alt}
                className="rounded-full w-[80px] md:w-[60px]"
              />
              <p className="text-center text-[8px] font-semibold m-2 md:text-[12px]">{card.text}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default cardHero;
