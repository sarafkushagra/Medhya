import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../src/ui/Button";
import { Card, CardContent } from "../../../src/ui/Card";
import img1 from "../../public/healthcare-1.png";
import img2 from "../../public/image-32.png";
import img3 from "../../public/image-38.png";
const topBarItems = [
  {
    icon: MapPinIcon,
    text: "281406 GLA UNIVERSITY , India",
  },
  {
    icon: MailIcon,
    text: "medhya@health.care",
  },
];
import "./tailwind.css";

const navItems = ["Home", "About", "Health Checkup", "Doctors", "Departments"];

export const HeroSection = ()=> {
  return (
    <section className="relative w-full">
      <div className="flex flex-col items-start gap-2.5">
        <div className="flex flex-col items-center gap-[19px] w-full">
          <div className="flex flex-col items-center gap-[31px] w-full">
            <div className="flex w-full items-center justify-between px-[156px] py-2.5 bg-[#00a0aa]">
              <div className="flex items-start gap-12">
                {topBarItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <item.icon className="w-[18px] h-[18px] text-[#f8f9fe]" />
                    <div className="font-paragraph-2 font-[number:var(--paragraph-2-font-weight)] text-[#f8f9fe] text-[length:var(--paragraph-2-font-size)] tracking-[var(--paragraph-2-letter-spacing)] leading-[var(--paragraph-2-line-height)] [font-style:var(--paragraph-2-font-style)]">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2">
                <PhoneIcon className="w-[18px] h-[18px] text-[#f8f9fe]" />
                <div className="[font-family:'Inter',Helvetica] font-medium text-[#f8f9fe] text-base tracking-[0] leading-[normal] underline whitespace-nowrap">
                  Connect on Whatsapp
                </div>
              </div>
            </div>

            <nav className="flex items-center justify-between w-full px-7 py-5 bg-white">
              <div className="flex items-center gap-[42px]">
                <div className="flex items-center gap-20">
                  <div className="flex items-center gap-2.5">
                    <img
                      className="w-[23px] h-[23px] object-cover"
                      alt="Healthcare"
                      src={img1}
                    />
                    <div className="font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-black text-[length:var(--button-text-1-font-size)] tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] whitespace-nowrap [font-style:var(--button-text-1-font-style)]">
                      Medhya
                    </div>
                  </div>

                  <div className="flex items-start gap-[25px]">
                    {navItems.map((item, index) => (
                      <button
                        key={index}
                        className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal] whitespace-nowrap hover:text-[#00a0aa] transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-[13.5px] h-[13.5px] text-black" />
                  <div className="font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-black text-[length:var(--button-text-1-font-size)] tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] whitespace-nowrap [font-style:var(--button-text-1-font-style)]">
                    1005-346-272
                  </div>
                </div>
              </div>

              <Button className="h-auto gap-2.5 p-5 bg-[#00a0aa] hover:bg-[#008a94] rounded-[10px]">
                <span className="font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-white text-[length:var(--button-text-1-font-size)] tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] [font-style:var(--button-text-1-font-style)]">
                  Appointment
                </span>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-[93px] w-full px-[90px] relative">
            <div className="flex items-start gap-2.5 relative">
              <div className="relative w-[497px] h-[480px]">
                <div className="absolute top-[33px] left-0 w-[497px] h-[447px] bg-[#ffc567] rounded-[20px]" />
                <img
                  className="absolute top-0 left-[38px] w-[424px] h-[480px]"
                  alt="Doctor"
                  src={img2}
                />
              </div>

              <Card className="absolute top-[286px] left-0 w-[180px] h-[60px] bg-white rounded-[5px] border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center gap-[5px] p-3">
                    <img
                      className="w-[29px] h-[31px]"
                      alt="Patients icon"
                      src={img3}
                    />
                    <div className="[font-family:'Satoshi-Medium',Helvetica] font-medium text-black text-sm tracking-[0] leading-[normal]">
                      More than 10K
                      <br />
                      Patients treated!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col w-[544px] items-start gap-[46px]">
              <div className="flex flex-col items-start gap-5">
                <div className="[font-family:'Satoshi-Bold',Helvetica] font-bold text-[#00a0aa] text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                  Welcome to Medhya Healthcare
                </div>
                <h1 className="font-heading-1 font-[number:var(--heading-1-font-weight)] text-black text-[length:var(--heading-1-font-size)] tracking-[var(--heading-1-letter-spacing)] leading-[var(--heading-1-line-height)] [font-style:var(--heading-1-font-style)]">
                  Your Journey to <br />
                  Better Health <br />
                  Starts Here
                </h1>
              </div>

              <Button className="h-auto gap-2.5 p-5 bg-[#00a0aa] hover:bg-[#008a94] rounded-[10px]">
                <span className="font-button-text-1 font-[number:var(--button-text-1-font-weight)] text-white text-[length:var(--button-text-1-font-size)] tracking-[var(--button-text-1-letter-spacing)] leading-[var(--button-text-1-line-height)] [font-style:var(--button-text-1-font-style)]">
                  Discover More
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
