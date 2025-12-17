import HeroSection from "../components/HomeSections/HeroSection";
import CategoriesGrid from "../components/HomeSections/CategoriesGrid";
import FeaturedProducts from "../components/HomeSections/FeaturedProducts";
import BrandsCarousel from "../components/HomeSections/BrandsCarousel";
import SpecialOffersBanner from "../components/HomeSections/SpecialOffersBanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesGrid />
      <SpecialOffersBanner />
      <BrandsCarousel />
       <Footer />

    </>
  );
}
