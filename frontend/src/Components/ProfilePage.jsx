import { BellIcon, ChevronRightIcon, Edit3Icon, XIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../src/ui/Avatar";
import { Badge } from "../../src/ui/Badge";
import { Button } from "../../src/ui/Button";
import { Card, CardContent } from "../../src/ui/Card";
import { Separator } from "../../src/ui/Separator";
import { Switch } from "../../src/ui/Switch";
import { Tabs, TabsList, TabsTrigger } from "../../src/ui/Tabs";

const tabItems = [
  { value: "general", label: "General" },
  { value: "consultation-history", label: "Consultation History" },
  { value: "patient-documents", label: "Patient Documents" },
];

const profileData = [
  {
    row: [
      { label: "Name", value: "Ani Cavalcanti" },
      { label: "Date Of Birth", value: "07/01/1997" },
      { label: "Age", value: "26" },
    ],
  },
  {
    row: [
      { label: "Phone Number", value: "+ 1 345 346 347" },
      { label: "Email Address", value: "martha.johnson@gmail.com" },
      { label: "Bio", value: "Cardiac Doctor" },
    ],
  },
];

const diseaseCategories = [
  {
    label: "Speech",
    tags: ["Dysarthria", "Apraxia"],
  },
  {
    label: "Speech",
    tags: ["Dysarthria", "Apraxia"],
  },
];

const physicalCategory = {
  label: "Physical",
  tags: ["Arthritis"],
};

export const ProfileGeneral = () => {
  return (
    <div className="bg-[#f6f6f6] w-full min-w-[1440px] flex flex-col gap-8 p-8">
      <header className="w-full flex items-start justify-between gap-4">
        <div className="inline-flex flex-col items-start">
          <div className="[font-family:'Inter',Helvetica] font-medium text-[#747474] text-xl tracking-[0] leading-[30px] whitespace-nowrap">
            Hi, Stevan dux
          </div>

          <h1 className="[font-family:'Inter',Helvetica] font-bold text-[#232323] text-[32px] tracking-[0] leading-[48px] whitespace-nowrap">
            Profile
          </h1>
        </div>

        <div className="inline-flex items-center gap-5">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-1 h-auto p-0 hover:bg-transparent"
          >
            <span className="[font-family:'Inter',Helvetica] font-normal text-[#232323] text-base tracking-[0] leading-[14px] whitespace-nowrap">
              EN
            </span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-auto w-auto p-0 hover:bg-transparent"
          >
            <BellIcon className="w-6 h-6" />
          </Button>

          <div className="inline-flex items-center gap-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src="/img-2265-1.png" alt="Stevan dux" />
            </Avatar>

            <div className="inline-flex flex-col items-start justify-center">
              <div className="[font-family:'Inter',Helvetica] font-semibold text-[#232323] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                Stevan dux
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="inline-flex items-start gap-5">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="inline-flex items-start gap-5 bg-transparent h-auto p-0">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-[200px] items-center justify-center gap-2.5 px-4 py-3.5 bg-white rounded-lg border border-solid border-neutral-200 data-[state=active]:bg-white data-[state=active]:border-transparent data-[state=inactive]:bg-transparent [font-family:'Inter',Helvetica] font-normal text-base text-center tracking-[0] leading-5 whitespace-nowrap data-[state=active]:text-[#232323] data-[state=inactive]:text-[#7a7d84] data-[state=active]:shadow-none h-auto"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>

      <Card className="w-full bg-white rounded-2xl border border-[#0000001a]">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-5">
              <Avatar className="w-[100px] h-[100px]">
                <AvatarImage src="/frame-1000001062.svg" alt="Ani Cavalcanti" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>

              <div className="inline-flex flex-col items-start gap-2">
                <div className="font-normal text-base leading-normal [font-family:'Inter',Helvetica] tracking-[0]">
                  <span className="font-semibold text-[#434966]">
                    Ani Cavalcanti{" "}
                  </span>
                  <span className="text-[#82889c] text-sm">(Female)</span>
                </div>

                <div className="[font-family:'Inter',Helvetica] font-normal text-[#82889c] text-sm tracking-[0] leading-normal">
                  Cardiac Doctor
                </div>

                <div className="font-normal text-[#82889c] text-xs [font-family:'Inter',Helvetica] tracking-[0] leading-normal">
                  Leeds,United Kingdom
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-lg border border-solid border-[#434966] h-auto"
            >
              <span className="[font-family:'Inter',Helvetica] font-semibold text-[#434966] text-sm tracking-[0] leading-5 whitespace-nowrap">
                Edit
              </span>
              <Edit3Icon className="w-[18px] h-[18px]" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col w-full items-start gap-4">
        {profileData.map((rowData, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="inline-flex items-start gap-[60px] w-full"
          >
            {rowData.row.map((field, fieldIndex) => (
              <div
                key={`field-${rowIndex}-${fieldIndex}`}
                className="flex flex-col gap-2 w-[264px]"
              >
                <div className="[font-family:'Inter',Helvetica] font-normal text-grey-palettegrey-5 text-sm tracking-[0] leading-[22px]">
                  {field.label}
                </div>
                <div className="font-medium text-grey-palettegrey-6 text-base leading-normal [font-family:'Inter',Helvetica] tracking-[0]">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <Card className="w-full bg-white rounded-xl border border-[#0000001a]">
        <CardContent className="p-5">
          <div className="flex flex-col gap-5">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-[#232323] text-lg tracking-[-0.36px] leading-[27px]">
              Pre-existing Diseases
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-5">
                {diseaseCategories.map((category, index) => (
                  <React.Fragment key={index}>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2">
                        <div className="[font-family:'Inter',Helvetica] font-normal text-grey-palettegrey-5 text-sm tracking-[0] leading-[22px]">
                          {category.label}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {category.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-[#f8f7fe] rounded hover:bg-[#f8f7fe]"
                            >
                              <span className="font-normal text-grey-palettegrey-6 text-sm leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                                {tag}
                              </span>
                              <XIcon className="w-3.5 h-3.5" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < diseaseCategories.length - 1 && (
                      <div className="self-stretch w-px bg-border" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="w-full max-w-[408px]">
                <div className="flex flex-col gap-2">
                  <div className="[font-family:'Inter',Helvetica] font-normal text-grey-palettegrey-5 text-sm tracking-[0] leading-[22px]">
                    {physicalCategory.label}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {physicalCategory.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-[#f8f7fe] rounded hover:bg-[#f8f7fe]"
                      >
                        <span className="font-normal text-grey-palettegrey-6 text-sm leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                          {tag}
                        </span>
                        <XIcon className="w-3.5 h-3.5" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white rounded-xl border border-[#0000001a]">
        <CardContent className="flex flex-col items-start gap-5 p-5">
          <h2 className="font-semibold text-[#232323] text-lg tracking-[-0.36px] leading-[27px] [font-family:'Inter',Helvetica]">
            General
          </h2>

          <div className="flex items-center gap-5 w-full">
            <div className="flex items-center flex-1">
              <div className="flex-1 [font-family:'Inter',Helvetica] font-medium text-black text-base leading-[34px]">
                Change Password
              </div>

              <Button
                variant="outline"
                className="h-auto px-2.5 py-2.5 border-[#3a99b7] text-[#3a99b7] hover:bg-[#3a99b7] hover:text-white rounded-lg"
              >
                <span className="font-normal text-sm leading-5 [font-family:'Inter',Helvetica]">
                  Change
                </span>
              </Button>
            </div>

            <Separator orientation="vertical" className="h-[34px]" />

            <div className="flex items-center flex-1">
              <div className="flex-1 [font-family:'Inter',Helvetica] font-medium text-black text-base leading-[34px]">
                Notifications
              </div>

              <div className="inline-flex items-center gap-2">
                <span className="[font-family:'Inter',Helvetica] font-normal text-grey-1 text-sm leading-6 whitespace-nowrap">
                  Enable Notifications
                </span>

                <Switch
                  defaultChecked
                  className="data-[state=checked]:bg-[#3a99b7]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
