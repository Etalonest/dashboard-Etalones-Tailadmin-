'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Image from "next/image";
import { Key, useEffect } from "react";
import { Blocks, ChevronRight, CircleCheck, HandCoins, HousePlus, MapPinned, Minus } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

const imagesCarousel = [
"/images/cards/cards-04.png",
"/images/cards/cards-05.png",
"/images/cards/cards-06.png",
"/images/cards/cards-04.png",
"/images/cards/cards-05.png",
"/images/cards/cards-06.png",
];    
const ViewVacancy = ({ vacancy }: any) => {
    const vacancyH = vacancy?.vacancy;
    console.log("vacancyH", vacancyH);
    useEffect(() => {
        if (vacancyH) {
            console.log("vacancyH", vacancyH);
        }
    }, [vacancyH]);
    return (
        <div>
            <Card className="m-4 relative">
                    <Breadcrumb className="m-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                Etalones
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                Вакансии
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{vacancyH?.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    
                <CardContent>

                    <div className="grid grid-cols-4 gap-10">
                        <div className="mt-8">
                            <h1 className="text-2xl font-bold">{vacancyH?.title}</h1>
                            <div className="text-sm text-gray-600 flex gap-2 items-center">
                                <span><MapPinned /></span><span>{vacancyH?.location}</span>
                            </div>
                            <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                            <Label className="text-xl font-bold my-2">Необходимые навыки</Label>
                            <div className="text-md my-5 text-gray-600 flex gap-2 items-center">
                        <Blocks /><span>{vacancyH?.roof_type}</span>
                    </div>
                            {vacancyH?.skills.split(';').map((item: string, index: any) => (
                                <div key={index} className="flex gap-2 justify-start items-center my-1">
                                    <CircleCheck size={18} className="flex-shrink-0" /> {item}
                                </div>
                            ))}
                            </Card>
                        </div>
                        <div className="mt-8 col-span-2 flex gap-25 justify-center">
                            <div>
                                <Label>Зароботная плата</Label>
                                <div className="flex gap-2 items-center justify-start">
                                    <HandCoins />
                                    <span className="text-2xl font-bold">{vacancyH?.salary}</span>
                                    <span className="text-sm text-gray-600 ">
                                        НЕТТО
                                    </span>
                                </div>
                                <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                                    <div>
                                    <Label className="font-semibold">Свободных мест</Label>
                                    - {vacancyH?.place}
                                    </div>
                                    <div>
                                    <Label className="font-semibold">Потенциал объекта</Label>
                                    - {vacancyH?.workHours}
                                    </div>
                                    </Card>
                            </div>
                            <div>
                                <Label>Стоимость проживания</Label>
                                <div className="flex gap-2 items-center justify-start">
                                    <HousePlus />
                                    <span className="text-2xl font-bold">{vacancyH?.homePrice}</span>
                                </div>
                                <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                                    <Label className="font-semibold">Условия проживания</Label>
                                {vacancyH?.home_descr.split(';').map((item: string, index: any) => (
                                    <div key={index} className="flex gap-2 justify-start items-start my-1">
                                        <CircleCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />{item}
                                    </div>
                                ))}</Card>
                            </div>
                        </div>
                        <Image src={imagesCarousel[1]}
                            alt={""} width={350} height={200}
                            className="rounded-md max-h-max" />
                    </div>
                    <div>
                        
                        <div className="grid grid-cols-3 gap-10">
                            <div className="col-span-2">
                                <Label className="text-xl font-bold my-2">О работе</Label>
                                {vacancyH?.work_descr.split(';').map((item: string, index: any) => (
                                    <div key={index} className="flex gap-2 justify-start items-start my-1">
                                        <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                    </div>
                                ))}
                            </div>
                            
                           
                        </div>
                    </div>
<div>
    <Label className="text-xl font-bold my-2">Фото жилья</Label>
     <Carousel 
      orientation="horizontal"
      opts={{
        align: "center", 
        loop: true, 
        
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4 flex">
      {imagesCarousel.map((image, index) => (
                        <CarouselItem key={index} className=" flex-shrink-0 md:w-1/4 pl-4 sm:w-1/2">
                          <div className="p-1">
                            <Image
                              src={image}
                              alt={`Image ${index + 1}`}
                              width={350}
                              height={200}
                              className="rounded-md max-h-max mx-auto"
                            />
                          </div>
                        </CarouselItem>
                      ))}
      </CarouselContent>
      <CarouselPrevious type='button' className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
        &lt;
      </CarouselPrevious>
      <CarouselNext type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
        &gt;
      </CarouselNext>
    </Carousel>
</div>
<div className="grid grid-cols-3 gap-10">
<div>
    <Label className="text-xl font-bold my-2">Необходимые документы</Label>
    {vacancyH?.documents.map((item: string, index: any) => (
                                    <div key={index} className="flex gap-2 justify-start items-start my-1">
                                        <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                    </div>
                                ))}
</div>
<div>
    <Label className="text-xl font-bold my-2">Знание языков</Label>
    {vacancyH?.langues.map((item: string, index: any) => (
                                    <div key={index} className="flex gap-2 justify-start items-start my-1">
                                        <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                    </div>
                                ))}
</div>
<div>
    <Label className="text-xl font-bold my-2">Категории водительского удостоверения</Label>
    {vacancyH?.drivePermis.map((item: string, index: any) => (
                                    <div key={index} className="flex gap-2 justify-start items-start my-1">
                                        <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                    </div>
                                ))}
</div>
</div>

                </CardContent>
                <CardFooter className="flex flex-col items-end">
<div className="flex gap-2 items-center">
    <Label className="my-2">Партнёр:</Label>
    <span className="font-semibold">
{vacancyH?.partner.name}
    </span>
</div>
<div className="flex gap-2 items-center">
    <Label className="my-2">Куратор:</Label>
    <span className="font-semibold">
{vacancyH?.manager?.name}
    </span>
</div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ViewVacancy;