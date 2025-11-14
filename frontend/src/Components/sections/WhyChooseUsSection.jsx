import { CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../src/ui/Button";
import "./tailwind.css";

import img1 from "../../public/image-36.png";
const whyChooseUsItems = [
  "Safety First Quality Must",
  "Patient-Centric Approach",
  "Focused Leadership",
  "Cutting-Edge Technology",
  "Transparent Pricing",
  "Coordinated Care",
];

export const WhyChooseUsSection = () => {
  return (
    <section className="flex flex-col items-start justify-center pt-[70px] pb-[100px] px-40 w-full bg-white">
      <div className="flex w-full max-w-[1073px] items-end justify-center gap-[150px] mb-[67px]">
        <div className="relative w-[385px] h-[340px] flex-shrink-0">
          <div className="relative h-[340px]">
            <div className="absolute top-[212px] left-0 w-[385px] h-32 bg-[#ffc567] rounded-[20px]" />
            <img
              className="absolute top-0 left-[82px] w-[264px] h-[339px] object-cover"
              alt="Medical professional"
              src={img1}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-[38px] pt-[49px] pl-[43px]">
          <h2 className="font-heading-3 font-[number:var(--heading-3-font-weight)] text-black text-[length:var(--heading-3-font-size)] tracking-[var(--heading-3-letter-spacing)] leading-[var(--heading-3-line-height)] [font-style:var(--heading-3-font-style)]">
            Why Choose Us?
          </h2>

          <div className="flex items-start gap-[15px]">
            <div className="flex flex-col gap-[30px] pt-1">
              {whyChooseUsItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckIcon
                    className="w-5 h-5 text-[#00a0aa] flex-shrink-0"
                    strokeWidth={3}
                  />
                  <span className="font-paragraph-1 font-[number:var(--paragraph-1-font-weight)] text-black text-[length:var(--paragraph-1-font-size)] tracking-[var(--paragraph-1-letter-spacing)] leading-[var(--paragraph-1-line-height)] [font-style:var(--paragraph-1-font-style)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-[43px] w-full max-w-[843px] ml-[73px]">
        <div className="flex flex-col items-start gap-[30px] w-full">
          <h3 className="font-heading-3 font-[number:var(--heading-3-font-weight)] text-black text-[length:var(--heading-3-font-size)] tracking-[var(--heading-3-letter-spacing)] leading-[var(--heading-3-line-height)] [font-style:var(--heading-3-font-style)]">
            Wellness, Compassion, Quality
          </h3>

          <p className="font-paragraph-1 font-[number:var(--paragraph-1-font-weight)] text-black text-[length:var(--paragraph-1-font-size)] tracking-[var(--paragraph-1-letter-spacing)] leading-[var(--paragraph-1-line-height)] [font-style:var(--paragraph-1-font-style)]">
            They live in Bookmarks grove right at the coast of the Semantics, a
            large language ocean. A small river named Duden flows by their place
            and supplies it.
          </p>
        </div>

        <Button className="h-auto bg-[#00a0aa] hover:bg-[#008a94] rounded-[10px] px-5 py-5">
          <span className="font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-white text-[length:var(--button-text-1-font-size)] tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] [font-style:var(--button-text-1-font-style)]">
            Take An Appointment
          </span>
        </Button>
      </div>
    </section>
  );
};
