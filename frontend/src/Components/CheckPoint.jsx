import React from "react";
import { ContactSection } from "./sections/ContactSection.jsx";
// import { FooterSection } from "./sections/FooterSection";
import { HealthCheckupPlansSection } from "./sections/HealthCheckupPlansSection.jsx";
import { HeroSection } from "./sections/HeroSection.jsx";
import { ServicesSection } from "./sections/ServicesSection.jsx";
import { SpecialityServicesSection } from "./sections/SpecialityServicesSection.jsx";
import { TestimonialsSection } from "./sections/TestimonialsSection.jsx";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection.jsx";

export const Box = () => {
  return (
    <div className="bg-[#f8f9fe] w-full min-w-[1440px]">
      <HeroSection />
      <ServicesSection />
      <SpecialityServicesSection />
      <WhyChooseUsSection />
      <HealthCheckupPlansSection />
      <TestimonialsSection />
      <ContactSection />
      {/* <FooterSection /> */}
    </div>
  );
};
