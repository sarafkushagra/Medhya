import React from "react";
import { Card, CardContent } from "../../../src/ui/Card";

import img1 from "../../public/image-41.png";
import img2 from "../../public/image-42.png";
import img3 from "../../public/image-43.png";
import "./tailwind.css";

const servicesData = [
  {
    id: 1,
    image: img1,
    subtitle: "For your health",
    title: "Pediatrician",
  },
  {
    id: 2,
    image: img2,
    subtitle: "For your health",
    title: "Cardiologist",
  },
  {
    id: 3,
    image: img3,
    subtitle: "For your health",
    title: "Dermatologist",
  },
];

export const ServicesSection = () => {
  return (
    <section className="w-full mx-48 my-28 flex flex-col gap-[92px]">
      <div className="flex flex-col items-start gap-[45px]">
        <h2 className="font-heading-2 font-bold text-black text-5xl leading-tight">
          Dedicated to provide best treatment.
        </h2>

        <p className="max-w-[883px] font-paragraph-1 font-normal text-[#2f2e2e] text-xl leading-7">
          A wonderful serenity has taken possession of my entire soul, like
          these sweet mornings of spring which I enjoy with my whole heart. I am
          alone, and feel the charm of existence in this spot, which was created
          for the bliss of souls like mine.
        </p>
      </div>

      <div className="flex items-start gap-[118px] flex-wrap">
        {servicesData.map((service) => (
          <div key={service.id} className="flex flex-col items-start gap-2.5">
            <div className="relative w-[300px] h-[244px]">
              <img
                className="w-[300px] h-[200px] object-cover"
                alt={service.title}
                src={service.image}
              />

              <Card className="absolute top-[150px] left-[23px] bg-[#00a0aa] border-0 rounded-[10px] shadow-none">
                <CardContent className="flex flex-col items-start gap-3.5 pt-5 pb-[30px] px-[30px] p-0">
                  <div className="font-button-text-2 font-semibold text-white text-base text-center uppercase tracking-wide whitespace-nowrap">
                    {service.subtitle}
                  </div>

                  <div className="font-bold text-white text-2xl text-center tracking-normal leading-normal whitespace-nowrap">
                    {service.title}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
