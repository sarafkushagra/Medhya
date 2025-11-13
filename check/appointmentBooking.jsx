import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const doctorDetails = [
  {
    icon: "/stethoscope.svg",
    text: "Dr. Steven John",
  },
  {
    icon: "/clock.svg",
    text: "30 mins",
  },
  {
    icon: "/videocamera.svg",
    text: "Video call details provided upon successful confirmation",
  },
  {
    icon: "/handcoins.svg",
    text: "Fees: zł150",
  },
];

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const calendarWeeks = [
  [
    { day: "1", disabled: true },
    { day: "2", disabled: true },
    { day: "3", disabled: false },
    { day: "4", disabled: false },
    { day: "5", disabled: false },
    { day: "6", disabled: false },
  ],
  [
    { day: "7", disabled: true },
    { day: "8", disabled: true },
    { day: "9", disabled: false },
    { day: "10", disabled: false, selected: true },
    { day: "11", disabled: false },
    { day: "12", disabled: false },
    { day: "13", disabled: false },
  ],
  [
    { day: "14", disabled: false },
    { day: "15", disabled: false },
    { day: "16", disabled: false },
    { day: "17", disabled: false },
    { day: "18", disabled: false },
    { day: "19", disabled: false },
    { day: "20", disabled: false },
  ],
  [
    { day: "21", disabled: false },
    { day: "22", disabled: false },
    { day: "23", disabled: false },
    { day: "24", disabled: false },
    { day: "25", disabled: false },
    { day: "26", disabled: false },
    { day: "27", disabled: false },
  ],
  [
    { day: "28", disabled: false },
    { day: "29", disabled: false },
    { day: "30", disabled: false },
    { day: "31", disabled: false },
    { day: "", hidden: true },
    { day: "", hidden: true },
    { day: "", hidden: true },
  ],
];

const timeSlots = [
  { time: "10:30am", selected: false },
  { time: "11:30am", selected: false },
  { time: "02:30pm", selected: true },
  { time: "03:00pm", selected: false },
  { time: "03:30pm", selected: false },
  { time: "04:30pm", selected: false },
  { time: "05:00pm", selected: false },
  { time: "05:30pm", selected: false },
];

export const BookingStep = () => {
  return (
    <div className="bg-[#f6f6f6] min-h-screen w-full flex flex-col">
      <header className="bg-white border-b border-[#e2e2e2] px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-[5.28px]">
          <img
            className="w-[28.84px] h-[28.84px]"
            alt="Streamline health"
            src="/streamline-health-care-2-solid.svg"
          />
          <div className="[font-family:'Inter',Helvetica] font-medium text-[#3a99b7] text-[31.7px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
            Healthi
          </div>
        </div>

        <div className="[font-family:'Inter',Helvetica] font-medium text-[#00000080] text-base tracking-[0] leading-[18px] whitespace-nowrap">
          Musaki Professional
        </div>

        <div className="flex items-start gap-2.5">
          <Button
            variant="outline"
            className="h-auto px-5 py-3.5 bg-white rounded-md border-0"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-[#3a99b7] text-base tracking-[0] leading-[18px] whitespace-nowrap">
              Entrar
            </span>
          </Button>

          <Button className="h-auto w-[215px] px-3 py-3.5 bg-[#3a99b7] rounded-md hover:bg-[#3a99b7]/90">
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0] leading-[18px] whitespace-nowrap">
              Registro
            </span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-[1039px] rounded-[10px] shadow-[0px_6px_14px_#00000014] bg-white border-0">
          <CardContent className="p-0">
            <div className="flex">
              <div className="flex-1 p-[34px] flex flex-col gap-[27px]">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-[46px] h-[46px] rounded-[23px] border border-[#d9d9d9] mb-[27px]"
                >
                  <img
                    className="w-8 h-8"
                    alt="Arrow down"
                    src="/arrowdown.svg"
                  />
                </Button>

                {doctorDetails.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <img
                      className="w-[30px] h-[30px] flex-shrink-0"
                      alt={detail.text}
                      src={detail.icon}
                    />
                    <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-lg tracking-[0] leading-[normal]">
                      {detail.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-px bg-[#e2e2e2]" />

              <div className="flex-1 p-[34px] flex flex-col">
                <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-xl tracking-[0] leading-[normal] mb-[30px]">
                  Select Date and Time
                </h2>

                <div className="flex items-center justify-between mb-[22px]">
                  <Button variant="ghost" size="icon" className="w-10 h-10 p-0">
                    <ChevronLeftIcon className="w-6 h-6" />
                  </Button>

                  <div className="[font-family:'Inter',Helvetica] font-medium text-black text-lg tracking-[0] leading-[normal]">
                    August 2023
                  </div>

                  <Button variant="ghost" size="icon" className="w-10 h-10 p-0">
                    <ChevronRightIcon className="w-6 h-6" />
                  </Button>
                </div>

                <div className="flex flex-col gap-5 mb-[27px]">
                  <div className="flex justify-between">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="w-[50px] [font-family:'Inter',Helvetica] font-normal text-black text-sm text-center tracking-[0] leading-[normal]"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {calendarWeeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex gap-5">
                        {week.map((date, dateIndex) => (
                          <Button
                            key={dateIndex}
                            variant="ghost"
                            className={`w-[50px] h-[50px] p-0 ${
                              date.hidden
                                ? "opacity-0 pointer-events-none"
                                : date.selected
                                  ? "bg-[#3a99b7] hover:bg-[#3a99b7]/90 rounded-[50px]"
                                  : ""
                            }`}
                            disabled={date.disabled}
                          >
                            <span
                              className={`[font-family:'Inter',Helvetica] text-base text-center tracking-[0] leading-[normal] whitespace-nowrap ${
                                date.selected
                                  ? "font-medium text-white"
                                  : date.disabled
                                    ? "font-normal text-[#c9c9c9]"
                                    : "font-normal text-black"
                              }`}
                            >
                              {date.day}
                            </span>
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[#e2e2e2] mb-[23px]" />

                <div className="[font-family:'Inter',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] mb-[19px]">
                  Thursday, 10th August
                </div>

                <div className="flex flex-wrap gap-[10px]">
                  {timeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-auto px-[19px] py-2 rounded ${
                        slot.selected
                          ? "bg-[#f6f6f6] border border-[#3a99b7]"
                          : "border-[0.5px] border-[#7e7e7e]"
                      }`}
                    >
                      <span className="[font-family:'Inter',Helvetica] font-normal text-black text-sm tracking-[0] leading-5 whitespace-nowrap">
                        {slot.time}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-[#e2e2e2] px-6 py-[21px] flex justify-end">
        <Button className="w-[215px] h-12 bg-[#3a99b7] rounded-lg hover:bg-[#3a99b7]/90">
          <span className="[font-family:'Inter',Helvetica] font-medium text-grey-palettewhite text-sm text-center tracking-[0.25px] leading-[22px]">
            Next
          </span>
        </Button>
      </footer>
    </div>
  );
};
