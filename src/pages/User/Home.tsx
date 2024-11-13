import Hero from "../../components/hero/hero";
import CardHero from "../../components/cardHero/cardHero";
import Recomendation from "../../components/recomendation/recomendation";
import RecomendationSparepart from "../../components/recomendationSparepart/recomendationSparepart";
import Footer from "../../components/footer/footer";
import HeroCarousel from "../../components/heroCarousel/heroCarousel";

const Home = () => {
  return (
    <div>
      <Hero />
      <CardHero />
      <HeroCarousel />
      <Recomendation />
      <RecomendationSparepart />
      <Footer />
    </div>
  );
};

export default Home;
