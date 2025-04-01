'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Blocks, ChevronRight, CircleCheck, HandCoins, HousePlus, MapPinned, Minus } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import CandidateVacancy from '@/src/components/CandidateVacancy/CandidateVacancy';

const ViewVacancy = ({ vacancy }: any) => {
    console.log("Vacancy in viewVacancy:", vacancy);
    const [vacancyH, setVacancyH] = useState<any>(vacancy || null);
    const [candidates, setCandidates] = useState<any[]>([]);
    console.log("Candidates in viewVacancy:", candidates);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidates = useCallback(async () => {
        if (!vacancyH?._id) return; // Если нет ID вакансии, не делаем запрос
    
        console.log("Начинаем загрузку кандидатов..."); // Лог до запроса
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`/api/candidates/forVacancy?vacancyId=${vacancyH._id}`);
            if (!response.ok) throw new Error(`Ошибка API: ${response.statusText}`);
    
            const data = await response.json();
            console.log("Полученные данные кандидатов:", data); // Лог данных после получения
    
            setCandidates(data.candidates);
        } catch (error) {
            setError('Ошибка при загрузке кандидатов');
            console.error('Ошибка при загрузке кандидатов:', error);
        } finally {
            setLoading(false);
        }
    }, [vacancyH?._id]);
    
    useEffect(() => {
        console.log("Обновление vacancyH:", vacancyH); // Логируем переменную vacancyH
        if (vacancyH?._id) {
            fetchCandidates();
        }
    }, [vacancyH, fetchCandidates]);
    
    useEffect(() => {
        console.log("Обновление списка кандидатов в ViewVacancy:", candidates);
    }, [candidates]); // Логируем, когда кандидаты обновляются
    

    if (!vacancyH) {
        return <p className="text-center text-gray-500">Загрузка вакансии...</p>;
    }

    return (
        <div>
            <Card className="m-4 relative">
                <Breadcrumb className="m-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>Etalones</BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>Вакансии</BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{vacancyH.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <CardContent>
                    <div className="grid grid-cols-4 gap-10">
                        <div className="mt-8">
                            <h1 className="text-2xl font-bold">{vacancyH.title}</h1>
                            <div className="text-sm text-gray-600 flex gap-2 items-center">
                                <MapPinned />
                                <span>{vacancyH.location}</span>
                            </div>
                            <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
                                <Label className="text-xl font-bold my-2">Необходимые навыки</Label>
                                <div className="text-md my-5 text-gray-600 flex gap-2 items-center">
                                    <Blocks />
                                    <span>{vacancyH.roof_type}</span>
                                </div>
                                {vacancyH.skills?.split(';').map((item: string, index: number) => (
                                    <div key={index} className="flex gap-2 justify-start items-center my-1">
                                        <CircleCheck size={18} className="flex-shrink-0" /> {item}
                                    </div>
                                ))}
                            </Card>
                        </div>
                        <div className="flex flex-col"> …
                        <div className="mt-8 col-span-2 flex gap-10 justify-center">
                            <div>
                                <Label>Заработная плата</Label>
                                <div className="flex gap-2 items-center">
                                    <HandCoins />
                                    <span className="text-2xl font-bold">{vacancyH.salary}</span>
                                    <span className="text-sm text-gray-600">НЕТТО</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 col-span-2 flex gap-10 justify-center">
                            <div>
                                <Label>Проживание</Label>
                                <div className="flex gap-2 items-center">
                                    <HandCoins />
                                    <span className="text-2xl font-bold">{vacancyH.homePrice}</span>
                                    <span className="text-sm text-gray-600">НЕТТО</span>
                                </div>
                            </div>
                        </div>
                        </div>
                        <Image src={vacancyH.imageFB || "/images/logo/logo-red.png"}
                            alt="Фото вакансии" width={350} height={200}
                            className="rounded-md max-h-max absolute top-3 right-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-10">
                        <div >
                            <Label className="text-xl font-bold my-2">О работе</Label>
                            {vacancyH.work_descr?.split(';').map((item: string, index: number) => (
                                <div key={index} className="flex gap-2 justify-start items-start my-1">
                                    <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                </div>
                            ))}
                        </div>
                        <div>
                            <Label className="text-xl font-bold my-2">Быт</Label>
                            {vacancyH.home_descr?.split(';').map((item: string, index: number) => (
                                <div key={index} className="flex gap-2 justify-start items-start my-1">
                                    <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                </div>
                            ))}
                    </div>
                    <div>
  {vacancyH.grafik && vacancyH.grafik.trim() !== '' && (
    <>
      <Label className="text-xl font-bold my-2">График</Label>
      {vacancyH.grafik.split(';').map((item: string, index: number) => (
        <div key={index} className="flex gap-2 justify-start items-start my-1">
          <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
        </div>
      ))}
    </>
  )}
</div>

                    </div>
                    {vacancyH.homeImageFB && (
                        <div>
                            <Label className="text-xl font-bold my-2">Фото жилья</Label>
                            <Carousel orientation="horizontal" opts={{ align: "center", loop: true }} className="w-full">
                                <CarouselContent className="-ml-4 flex">
                                    {vacancyH.homeImageFB.map((image: string, index: number) => (
                                        <CarouselItem key={index} className="flex-shrink-0 md:w-1/4 pl-4 sm:w-1/2">
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
                    )}
                </CardContent>

                <CardFooter className="flex flex-col items-start">
                    <div className="flex gap-2 items-center">
                        <Label className="my-2">Партнёр:</Label>
                        <span className="font-semibold">{vacancyH.partner?.companyName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Label className="my-2">Куратор:</Label>
                        <span className="font-semibold">{vacancyH.manager?.name}</span>
                    </div>
                </CardFooter>

                {/* <CandidateVacancy candidates={candidates} /> */}
            </Card>
        </div>
    );
};

export default ViewVacancy;
