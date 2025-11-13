import { ArrowLeftIcon, ChevronDownIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";

const bookingDetails = [
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
  {
    icon: "/calendarblank.svg",
    text: "02:30pm - 03:00pm, Thursday, August 10th",
  },
];

const paymentOptions = [
  { id: "paypal", label: "Paypal" },
  { id: "paytm", label: "Paytm" },
  { id: "creditcard", label: "Credit Card" },
];

export const BookingStep = () => {
  return (
    <div className="bg-[#f6f6f6] w-full min-h-screen flex flex-col">
      <header className="w-full h-[90px] border-b border-[#e2e2e2] bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-1">
          <img className="flex-[0_0_auto]" alt="Frame" src="/frame-65.svg" />
          <div className="[font-family:'Inter',Helvetica] font-semibold text-[#232323] text-base whitespace-nowrap">
            Musaki
          </div>
        </div>

        <div className="[font-family:'Inter',Helvetica] font-medium text-[#00000080] text-base whitespace-nowrap">
          Musaki Professional
        </div>

        <div className="flex items-start gap-2.5">
          <Button
            variant="outline"
            className="h-auto px-5 py-3.5 bg-white rounded-md"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-[#3a99b7] text-base">
              Entrar
            </span>
          </Button>

          <Button className="h-auto w-[215px] px-3 py-3.5 bg-[#3a99b7] rounded-md hover:bg-[#3a99b7]/90">
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-base">
              Registro
            </span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-[90px]">
        <Card className="w-[1039px] rounded-[10px] shadow-[0px_6px_14px_#00000014] bg-white border-0">
          <CardContent className="p-0">
            <div className="relative p-[27px]">
              <Button
                variant="outline"
                size="icon"
                className="w-[46px] h-[46px] rounded-[23px] border-[#d9d9d9] absolute top-[27px] left-[30px]"
              >
                <ArrowLeftIcon className="w-8 h-8" />
              </Button>

              <div className="flex gap-[30px] pl-[461px]">
                <Separator
                  orientation="vertical"
                  className="h-[649px] bg-[#e2e2e2]"
                />

                <div className="flex-1 pt-[11px]">
                  <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-xl mb-[44px]">
                    Enter Details
                  </h2>

                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="patient-name"
                        className="[font-family:'Inter',Helvetica] font-normal text-black text-sm"
                      >
                        Patient&apos;s Name
                      </Label>
                      <Input
                        id="patient-name"
                        defaultValue="steve.madden@gmail.com"
                        className="h-auto px-4 py-3 rounded-md border-[#d0d0d1] [font-family:'Inter',Helvetica] font-normal text-black text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="contact-number"
                        className="[font-family:'Inter',Helvetica] font-normal text-[#232323] text-sm"
                      >
                        Contact Number
                      </Label>
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-md border border-[#d1d1d2]">
                        <div className="flex items-center gap-1.5">
                          <img
                            className="w-[39px] h-[23.4px] object-cover"
                            alt="Country flag"
                            src="/image-5.png"
                          />
                          <span className="[font-family:'Inter',Helvetica] font-normal text-[#232323] text-sm">
                            +351
                          </span>
                          <ChevronDownIcon className="w-5 h-5" />
                          <Separator
                            orientation="vertical"
                            className="h-5 bg-[#e2e2e2]"
                          />
                        </div>
                        <Input
                          id="contact-number"
                          placeholder="Enter Mobile Number"
                          className="h-auto border-0 p-0 [font-family:'Inter',Helvetica] font-normal text-[#7a7d84] text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="problem"
                        className="[font-family:'Inter',Helvetica] font-normal text-black text-sm"
                      >
                        Problem
                      </Label>
                      <Select defaultValue="fever">
                        <SelectTrigger
                          id="problem"
                          className="h-auto px-4 py-3 rounded-[5px] border-[#d0d0d1] [font-family:'Inter',Helvetica] font-normal text-black text-sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fever">Fever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-6">
                      <Separator className="bg-[#e2e2e2]" />

                      <div className="flex flex-col gap-[23px]">
                        <h3 className="[font-family:'Inter',Helvetica] font-normal text-black text-base">
                          Payment Details
                        </h3>

                        <RadioGroup
                          defaultValue="paypal"
                          className="flex flex-col gap-5"
                        >
                          {paymentOptions.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-1.5"
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                                className="w-5 h-5 border-[#3a99b7] data-[state=checked]:border-[#3a99b7] data-[state=unchecked]:border-[#d9d9d9]"
                              />
                              <Label
                                htmlFor={option.id}
                                className="[font-family:'Inter',Helvetica] font-normal text-[#232323] text-sm cursor-pointer"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-[66px] left-[30px] flex flex-col gap-[27px] w-[403px]">
                {bookingDetails.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <img
                      className="w-[30px] h-[30px] flex-shrink-0"
                      alt="Icon"
                      src={detail.icon}
                    />
                    <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-lg">
                      {detail.text}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="h-12 w-[215px] bg-[#3a99b7] rounded-lg hover:bg-[#3a99b7]/90 absolute bottom-[27px] right-[30px]">
                <span className="[font-family:'Inter',Helvetica] font-medium text-grey-palettewhite text-sm">
                  Confirm
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
