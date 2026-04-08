import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import { PremiumSection, MembershipSection } from "../components/home/PremiumSection";
import EventsPreview from "../components/home/EventsPreview";
import { GalleryPreview, SubscribeSection } from "../components/home/GalleryPreview";
import ContactSection from "../components/home/ContactSection";
import { useEffect } from "react";
const Home = () => (
    
  <main>
    <HeroSection />
    <AboutSection />
    <PremiumSection />
    <MembershipSection />
    <EventsPreview />
    <GalleryPreview />
    <SubscribeSection />
    <ContactSection />
  </main>
);

export default Home;