import React from "react";


import img1 from "../../public/image-40.png";
import img2 from "../../public/frame-429.png";
import img3 from "../../public/frame-428.png";
import img4 from "../../public/frame-451.png";
import "./tailwind.css";

export const TestimonialsSection = () => {
  const testimonialData = {
    image: img1,
    stars: img2,
    divider: img3,
    quote:
      '"A wonderful serenity has taken possession of my entire soul,\nlike these sweet mornings of spring which I enjoy".',
    author: "Mr. Williams",
    role: "Diabetes Patient",
    navigationDots: img4,
  };

  return (
    <section className="w-full px-[152px] py-[100px]">
      <div className="w-full max-w-[1136px] mx-auto">
        <div className="flex items-start justify-center gap-[83px]">
          <div className="relative w-[362px] h-[365px] flex-shrink-0">
            <div className="absolute bottom-0 left-0 w-full h-[111px] bg-[#ffc567] rounded-[20px]" />
            <img
              className="absolute top-0 left-[34px] w-[297px] h-[365px] object-contain"
              alt="Testimonial"
              src={testimonialData.image}
            />
          </div>

          <div className="flex flex-col w-[469px] gap-10 pt-0">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-[15px]">
                <img
                  className="w-12 h-12"
                  alt="Rating stars"
                  src={testimonialData.stars}
                />

                <img
                  className="w-60 h-auto"
                  alt="Divider"
                  src={testimonialData.divider}
                />

                <p className="w-[477px] font-sub-heading-1 font-medium text-[#091e29] text-2xl leading-9 italic">
                  {testimonialData.quote}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="font-paragraph-1 font-normal text-[#091e29] text-xl leading-7">
                {testimonialData.author}
              </div>

              <div className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-[#091e29] text-base tracking-[0] leading-[normal]">
                {testimonialData.role}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-[47px]">
          <img
            className="w-[1136px] h-[53px]"
            alt="Navigation dots"
            src={testimonialData.navigationDots}
          />
        </div>
      </div>
    </section>
  );
};
