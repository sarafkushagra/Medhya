import { EyeIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const Login = () => {
  const socialLogins = [{ name: "Google", icon: "/frame-1000001063.svg" }];

  const infoCards = [
    {
      icon: "/magnifyingglass.svg",
      title: "Well qualified doctors",
      subtitle: "Treat with atmost care",
      className:
        "top-[325px] left-[18px] w-[355px] gap-[12.41px] p-[14.9px] rounded-[12.41px] shadow-[0px_4.97px_9.93px_#54b9ed1a] backdrop-blur-[8.69px]",
      iconSize: "w-[52.13px] h-[52.13px]",
      titleSize: "text-[22.3px]",
      subtitleSize: "text-[19.9px]",
      gap: "gap-[9.93px]",
      innerGap: "gap-[2.48px]",
    },
    {
      icon: "/notepad.svg",
      title: "Book an appointment",
      subtitle: "Call/text/video/inperson",
      className:
        "top-[817px] left-[263px] w-[425px] gap-[14.86px] p-[17.83px] rounded-[14.86px] shadow-[0px_5.94px_11.89px_#54b9ed1a] backdrop-blur-[10.4px]",
      iconSize: "w-[62.42px] h-[62.42px]",
      titleSize: "text-[26.7px]",
      subtitleSize: "text-[23.8px]",
      gap: "gap-[11.89px]",
      innerGap: "gap-[2.97px]",
    },
  ];

  return (
    <div className="bg-white w-full min-w-[1440px] min-h-[1024px] relative">
      <aside className="absolute top-0 left-0 w-[710px] h-[1024px] flex flex-col gap-[23px] bg-[#869ca3] overflow-hidden">
        <header className="inline-flex ml-[-9.8px] h-[88px] w-[324.15px] self-center relative mt-[113px] items-center gap-[12.1px]">
          <img
            className="relative w-[66.05px] h-[66.05px]"
            alt="Streamline health"
            src="/streamline-health-care-2-solid.svg"
          />

          <h1 className="relative w-fit mt-[-3.03px] [font-family:'Inter',Helvetica] font-medium text-white text-[72.6px] text-center tracking-[0] leading-[normal]">
            Healthi
          </h1>
        </header>

        <div className="ml-[-225px] w-[1161px] h-[1161px] relative">
          <div className="absolute top-[105px] left-[68px] w-[1013px] h-[951px] bg-[#b0b9bc] rounded-[506.64px/475.51px]" />

          <div className="absolute top-0 left-0 w-[1161px] h-[1161px] rounded-[580.5px] border-[29.3px] border-solid border-[#b0b9bc]" />
        </div>
      </aside>

      <main className="inline-flex flex-col items-center gap-10 absolute top-[calc(50.00%_-_274px)] left-[calc(50.00%_+_110px)]">
        <div className="inline-flex flex-col items-center gap-2 relative flex-[0_0_auto]">
          <h2 className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-bold text-black text-5xl tracking-[-1.00px] leading-[normal]">
            Welcome back
          </h2>

          <p className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-transparent text-xl tracking-[0] leading-[normal] whitespace-nowrap">
            <span className="text-[#878787]">New to Musaki? </span>

            <a href="#" className="font-medium text-[#3a99b7] underline">
              Sign up
            </a>
          </p>
        </div>

        <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
          <Label
            htmlFor="email"
            className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]"
          >
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="Email address"
            className="w-[490px] h-auto px-4 py-3.5 rounded-[10px] border border-solid border-[#b5b6b7] [font-family:'Inter',Helvetica] font-normal text-black text-base"
          />
        </div>

        <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
          <Label
            htmlFor="password"
            className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]"
          >
            Your password
          </Label>

          <div className="flex w-[490px] items-center justify-between px-4 py-3.5 relative flex-[0_0_auto] rounded-[10px] border border-solid border-[#b5b6b7]">
            <Input
              id="password"
              type="password"
              defaultValue="···········"
              className="border-0 p-0 h-auto flex-1 [font-family:'Inter',Helvetica] font-bold text-black text-base tracking-[6.00px] leading-[22px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <EyeIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col w-[489px] items-center justify-center gap-4 relative flex-[0_0_auto]">
          <Button className="w-[491px] h-auto px-2.5 py-[13px] ml-[-1.00px] mr-[-1.00px] bg-[#3a99b7] hover:bg-[#3a99b7]/90 rounded-[10px] [font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-[22px]">
            Log in
          </Button>

          <div className="flex w-[490px] items-center justify-between relative flex-[0_0_auto] ml-[-0.50px] mr-[-0.50px]">
            <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
              <Checkbox
                id="remember"
                className="w-6 h-6 rounded border border-solid border-neutral-200"
              />

              <Label
                htmlFor="remember"
                className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] whitespace-nowrap cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <a
              href="#"
              className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-[#3a99b7] text-base tracking-[0] leading-[normal] whitespace-nowrap"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]">
            Or log in with
          </p>

          <img
            className="relative self-stretch w-full flex-[0_0_auto]"
            alt="Frame"
            src="/frame-1000001063.svg"
          />
        </div>
      </main>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-[34px] left-[1392px] w-6 h-6 p-0"
      >
        <XIcon className="w-6 h-6" />
      </Button>

      <img
        className="absolute w-[64.79%] h-[70.31%] top-[29.69%] left-0 object-cover"
        alt="Freepik export"
        src="/freepik-export-202406130959061bq8-1.png"
      />

      {infoCards.map((card, index) => (
        <Card
          key={index}
          className={`flex flex-col items-start bg-[#00000080] backdrop-blur backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10.4px)_brightness(100%)] absolute ${card.className}`}
        >
          <CardContent className="p-0">
            <div
              className={`inline-flex items-center justify-center ${card.gap} relative flex-[0_0_auto]`}
            >
              <img
                className={`relative ${card.iconSize}`}
                alt={card.title}
                src={card.icon}
              />

              <div
                className={`inline-flex flex-col items-start justify-center ${card.innerGap} relative flex-[0_0_auto]`}
              >
                <h3
                  className={`relative w-fit mt-[-1.49px] [font-family:'Inter',Helvetica] font-medium text-white ${card.titleSize} text-center tracking-[0] leading-[normal] whitespace-nowrap`}
                >
                  {card.title}
                </h3>

                <p
                  className={`relative flex items-center justify-center w-fit [font-family:'Inter',Helvetica] font-normal text-[#ffffff99] ${card.subtitleSize} tracking-[0] leading-[35.7px] whitespace-nowrap`}
                >
                  {card.subtitle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

