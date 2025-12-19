import HeroSection from "../components/HomeSections/HeroSection";
import CategoriesGrid from "../components/HomeSections/CategoriesGrid";
import FeaturedProducts from "../components/HomeSections/FeaturedProducts";
import BrandsCarousel from "../components/HomeSections/BrandsCarousel";
import SpecialOffersBanner from "../components/HomeSections/SpecialOffersBanner";
import Footer from "../components/Footer";
import SectionTitle from "../components/SectionTitle";
import { useTranslation } from "react-i18next"; // ← جديد

export default function Home() {
  const { t } = useTranslation(); // ← جديد

  return (
    <>
      <HeroSection />

      <SectionTitle
        title={t("home.featured_products")}
        link="/store?featured=true"
        icon="star"
      />
      <FeaturedProducts />

      <SectionTitle
        title={t("home.categories")}
        link="/store?category=all"
        icon="tools"
      />
      <CategoriesGrid />

      <SpecialOffersBanner />

      <SectionTitle
        title={t("home.favorite_brands")}
        link="/store?brand=all"
        icon="tag"
      />
      <BrandsCarousel />

      <Footer />
    </>
  );
}
