import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import img1 from "../../public/image-27.png";
import img2 from "../../public/screen-shot-2023-09-14-at-14-01-1.png";
import img3 from "../../public/screen-shot-2023-09-14-at-14-01.png";
import img4 from "../../public/screen-shot-2023-09-14-at-14-02.png";
import "./tailwind.css";



const servicesData = [
  {
    icon: img1,
    title: "Mental Health Service",
    description:
      "The service provides immediate medical care to patients with acute illnesses or injuries that require immediate attention",
  },
  {
    icon: img2,
    title: "Eye Diseasses Service",
    description:
      "The service provides immediate medical care to patients with acute illnesses or injuries that require immediate attention",
  },
  {
    icon: img3,
    title: "Vaccination Service",
    description:
      "The service provides immediate medical care to patients with acute illnesses or injuries that require immediate attention",
  },
  {
    icon: img4,
    title: "Cardiology Service",
    description:
      "The service provides immediate medical care to patients with acute illnesses or injuries that require immediate attention",
  },
];

export const SpecialityServicesSection = () => {
  return (
    <section className="w-full px-40 py-[100px]">
      <div className="flex flex-col items-center gap-[65px]">
        <div className="flex items-end justify-between w-full gap-8">
          <div className="flex flex-col items-start gap-5">
            <div className="font-button-text-2 font-semibold text-[#09a4ad] text-base text-center uppercase tracking-wide">
              SERVICES &amp; TREATMENTS
            </div>

            <h2 className="w-[538px] font-heading-2 font-bold text-black text-5xl leading-tight">
              More than 40 specialty and health care services
            </h2>
          </div>

          <Button className="h-auto bg-[#00a0aa] hover:bg-[#008a94] rounded-[10px] px-5 py-5">
            <span className="font-button-text-1 font-bold text-white text-xl text-center">
              See All Services
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-[38px] w-full">
          {servicesData.map((service, index) => (
            <Card
              key={index}
              className="bg-white rounded-[10px] border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-10">
                <div className="flex items-start gap-11 mb-[30px]">
                  <img
                    className="w-[52px] h-[52px] object-contain flex-shrink-0"
                    alt={service.title}
                    src={service.icon}
                  />

                  <div className="flex flex-col gap-[30px] flex-1">
                    <h3 className="font-sub-heading-1 font-medium text-black text-2xl leading-9">
                      {service.title}
                    </h3>

                    <p className="w-[300px] font-paragraph-2 font-medium text-[#091e29] text-lg leading-7">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <ArrowRightIcon className="w-[81px] h-[55px] text-[#00a0aa]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
