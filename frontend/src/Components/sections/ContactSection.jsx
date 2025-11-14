import React from "react";
import { Button } from "../../../src/ui/Button";
import { Card, CardContent } from "../../../src/ui/Card";
import { Input } from "../../../src/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/ui/Select";
import { Textarea } from "../../../src/ui/TextArea";
import img1 from "../../public/frame-202.png";

import "./tailwind.css";

const contactInfo = [
  {
    text: "(123) 456-7890",
  },
  {
    text: "medhya@health.life",
  },
];



export const ContactSection = () => {
  return (
    <section className="flex items-center gap-[50px] px-44 py-[100px] w-full">
      <div className="flex flex-col items-start gap-14 flex-1">
        <div className="flex flex-col items-start gap-11">
          <div className="flex flex-col items-start gap-5">
            <div className="font-bold text-[#09a4ad] text-xs text-center uppercase tracking-wide whitespace-nowrap">
              APPOINTMENT
            </div>

            <h2 className="w-[464px] font-heading-3 font-bold text-black text-4xl leading-tight">
              Get in touch to book <br />
              your first appointment
            </h2>
          </div>

          <p className="w-[414px] font-medium text-black text-xl leading-relaxed">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia.
          </p>
        </div>

        <div className="flex items-start gap-[17px]">
          <img className="flex-shrink-0 " alt="Frame" src={img1} />

          <div className="flex flex-col mt-2 items-start gap-[55px]">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`w-[520px] text-black ${
                  index === 0
                    ? "text-xl [font-family:'Satoshi-Medium',Helvetica] font-large"
                    : "font-paragraph-1 font-[number:var(--paragraph-1-font-weight)] text-[length:var(--paragraph-1-font-size)]"
                } tracking-[${index === 0 ? "0" : "var(--paragraph-1-letter-spacing)"}] leading-[${
                  index === 0 ? "normal" : "var(--paragraph-1-line-height)"
                }] ${index === 1 ? "[font-style:var(--paragraph-1-font-style)]" : ""}`}
              >
                {info.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="w-[475px] bg-white rounded-[20px] border-0 shadow-none">
        <CardContent className="p-[30px_35px]">
          <div className="flex flex-col items-start gap-4">
            <Input
              placeholder="Name"
              className="w-full h-auto px-[19px] py-3.5 bg-white rounded-[10px] border border-solid border-[#d9d9d9] font-paragraph-2 font-medium text-lg placeholder:text-[#979797]"
            />

            <Input
              placeholder="Phone"
              className="w-full h-auto px-[19px] py-3.5 bg-white rounded-[10px] border border-solid border-[#d9d9d9] font-paragraph-2 font-medium text-lg placeholder:text-[#979797]"
            />

            <Input
              placeholder="Email"
              type="email"
              className="w-full h-auto px-[19px] py-3.5 bg-white rounded-[10px] border border-solid border-[#d9d9d9] font-paragraph-2 font-medium text-lg placeholder:text-[#979797]"
            />

            <Select>
              <SelectTrigger className="w-full h-auto px-[19px] py-3 bg-white rounded-[10px] border border-solid border-[#d9d9d9] font-paragraph-2 font-medium text-[#979797] text-lg">
                <SelectValue placeholder="Select appointment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Consultation</SelectItem>
                <SelectItem value="specialist">
                  Specialist Consultation
                </SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Message"
              className="w-full h-[159px] px-[19px] py-[17px] bg-white rounded-[10px] border border-solid border-[#d9d9d9] font-paragraph-2 font-medium text-lg placeholder:text-[#979797] resize-none"
            />

            <Button className="w-full h-auto px-[157px] py-4 bg-[#18a0a9] hover:bg-[#18a0a9]/90 rounded-[5px] font-button-text-1 font-bold text-white text-xl">
              Submit Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
