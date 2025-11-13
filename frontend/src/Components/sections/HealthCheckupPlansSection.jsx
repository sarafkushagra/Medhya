import React from "react";
import { Button } from "../../../src/ui/Button";

const tabs = [
  { id: "woman-health", label: "Woman Health", active: true },
  { id: "cancer-screening", label: "Cancer Screening", active: false },
  { id: "kids-vaccines", label: "Kids Vaccines", active: false },
];
import "./tailwind.css";

import img1 from "../../public/frame-546.png";
import img2 from "../../public/frame-166.png";
import img3 from "../../public/image-30.png";
const checkupFeatures = [
  "Complete Blood Count with ESR",
  "Lipid Profile, Live Profile, kidney Profile",
  "USG Abdomen with Pelvis, Mammography",
];

export const HealthCheckupPlansSection = () => {
  return (
    <section className="flex flex-col items-center gap-5 px-4 py-[100px] w-full">
      <div className="flex flex-col items-center gap-10 w-full max-w-[968px]">
        <div className="flex flex-col items-center gap-[30px]">
          <h2 className="font-heading-3 font-[number:var(--heading-3-font-weight)] text-[#091e29] text-[length:var(--heading-3-font-size)] text-center tracking-[var(--heading-3-letter-spacing)] leading-[var(--heading-3-line-height)] [font-style:var(--heading-3-font-style)]">
            Health Checkup Plans
          </h2>

          <p className="max-w-[520px] font-paragraph-1 font-[number:var(--paragraph-1-font-weight)] text-[#091e29] text-[length:var(--paragraph-1-font-size)] text-center tracking-[var(--paragraph-1-letter-spacing)] leading-[var(--paragraph-1-line-height)] [font-style:var(--paragraph-1-font-style)]">
            They live in Bookmarks grove right at the coast of the Semantics, a
            large language ocean named flows.
          </p>
        </div>

        <nav className="flex items-center gap-[33px] px-5 py-5 bg-white rounded-[10px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center justify-center gap-2.5 px-5 py-5 rounded-[10px] font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-[length:var(--button-text-1-font-size)] tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] [font-style:var(--button-text-1-font-style)] whitespace-nowrap transition-colors ${
                tab.active
                  ? "bg-[#18a0a9] text-white"
                  : "bg-transparent text-[#091e29] hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-10 w-full max-w-[968px]">
        <div className="flex flex-col items-start gap-[50px]">
          <div className="flex flex-col items-start gap-[22px]">
            <img className="flex-shrink-0" alt="Frame" src={img1} />

            <div className="flex flex-col items-start gap-7">
              <div className="flex flex-col items-start gap-5">
                <h3 className="font-sub-heading-1 font-[number:var(--sub-heading-1-font-weight)] text-[#091e29] text-[length:var(--sub-heading-1-font-size)] tracking-[var(--sub-heading-1-letter-spacing)] leading-[var(--sub-heading-1-line-height)] [font-style:var(--sub-heading-1-font-style)]">
                  Women Health Checkup
                </h3>

                <p className="max-w-[511px] font-paragraph-2 font-[number:var(--paragraph-2-font-weight)] text-[length:var(--paragraph-2-font-size)] text-[#091e29] tracking-[var(--paragraph-2-letter-spacing)] leading-[var(--paragraph-2-line-height)] [font-style:var(--paragraph-2-font-style)]">
                  A wonderful serenity has taken possession of my entire soul,
                  like these sweet mornings of spring.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <img
                  className="flex-shrink-0"
                  alt="Frame"
                  src={img2}
                />

                <ul className="flex flex-col items-start gap-[40px]">
                  {checkupFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="font-paragraph-2 font-[number:var(--paragraph-2-font-weight)] text-[#091e29] text-[length:var(--paragraph-2-font-size)] tracking-[var(--paragraph-2-letter-spacing)] leading-[var(--paragraph-2-line-height)] [font-style:var(--paragraph-2-font-style)]"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Button className="h-auto flex items-center justify-center gap-2.5 px-5 py-5 bg-[#00a0aa] hover:bg-[#008a94] rounded-[10px] font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-white text-[length:var(--button-text-1-font-size)] text-center tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] [font-style:var(--button-text-1-font-style)]">
            Take An Appointment
          </Button>
        </div>

        <div className="relative flex items-start flex-shrink-0">
          <div className="absolute top-[402px] left-0 w-[418px] h-[121px] bg-[#ffc567] rounded-[20px]" />
          <img
            className="relative w-[418px] h-[523px] z-10"
            alt="Image"
            src={img3}
          />
        </div>
      </div>
    </section>
  );
};
