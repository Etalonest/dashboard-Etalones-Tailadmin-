// 'use client';
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { Blocks, ChevronRight, CircleCheck, HandCoins, HousePlus, MapPinned, Minus } from "lucide-react";
// import { Label } from "@radix-ui/react-dropdown-menu";
// import CandidateVacancy from '@/src/components/CandidateVacancy/CandidateVacancy'; // Импортируем новый компонент для кандидатов
// import { ScrollArea } from "@/components/ui/scroll-area";

// const ViewVacancy = ({ vacancy }: any) => {
//     const vacancyH = vacancy;
// console.log("VACANCY", vacancyH);
//     const [candidates, setCandidates] = useState<any[]>([]);  // Состояние для кандидатов

//     // Загрузка кандидатов при первом рендере
//     useEffect(() => {
//         if (!vacancyH) return; // Если вакансия не загружена, не делаем запрос

//         const fetchCandidates = async () => {
//             try {
//                 const response = await fetch(`/api/candidates/forVacancy?vacancyId=${vacancyH._id}`);
//                 if (!response.ok) throw new Error(`Ошибка API: ${response.statusText}`);
//                 const data = await response.json();
//                 setCandidates(data.candidates || []); // Обновляем список кандидатов
//             } catch (error) {
//                 console.error('Ошибка при загрузке кандидатов:', error);
//             }
//         };

//         fetchCandidates();
//     }, [vacancyH]); 

//     return (
//         <div>
//             <Card className="m-4 relative">
//                 <Breadcrumb className="m-4">
//                     <BreadcrumbList>
//                         <BreadcrumbItem>
//                             Etalones
//                         </BreadcrumbItem>
//                         <BreadcrumbSeparator>
//                             <ChevronRight className="h-4 w-4" />
//                         </BreadcrumbSeparator>
//                         <BreadcrumbItem>
//                             Вакансии
//                         </BreadcrumbItem>
//                         <BreadcrumbSeparator>
//                             <ChevronRight className="h-4 w-4" />
//                         </BreadcrumbSeparator>
//                         <BreadcrumbItem>
//                             <BreadcrumbPage>{vacancyH?.title}</BreadcrumbPage>
//                         </BreadcrumbItem>
//                     </BreadcrumbList>
//                 </Breadcrumb>

//                 <CardContent>
//                     {/* Контент вакансии */}
//                     <div className="grid grid-cols-4 gap-10">
//                         <div className="mt-8">
//                             <h1 className="text-2xl font-bold">{vacancyH?.title}</h1>
//                             <div className="text-sm text-gray-600 flex gap-2 items-center">
//                                 <span><MapPinned /></span><span>{vacancyH?.location}</span>
//                             </div>
//                             <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
//                                 <Label className="text-xl font-bold my-2">Необходимые навыки</Label>
//                                 <div className="text-md my-5 text-gray-600 flex gap-2 items-center">
//                                     <Blocks /><span>{vacancyH?.roof_type}</span>
//                                 </div>
//                                 {vacancyH?.skills?.split(';').map((item: string, index: any) => (
//                                     <div key={index} className="flex gap-2 justify-start items-center my-1">
//                                         <CircleCheck size={18} className="flex-shrink-0" /> {item}
//                                     </div>
//                                 ))}
//                             </Card>
//                         </div>
//                         <div className="mt-8 col-span-2 flex gap-25 justify-center">
//                             <div>
//                                 <Label>Зароботная плата</Label>
//                                 <div className="flex gap-2 items-center justify-start">
//                                     <HandCoins />
//                                     <span className="text-2xl font-bold">{vacancyH?.salary}</span>
//                                     <span className="text-sm text-gray-600 ">НЕТТО</span>
//                                 </div>
//                                 <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
//                                     <div>
//                                         <Label className="font-semibold">Свободных мест</Label>
//                                         - {vacancyH?.place}
//                                     </div>
//                                     <div>
//                                         <Label className="font-semibold">Потенциал объекта</Label>
//                                         - {vacancyH?.workHours}
//                                     </div>
//                                 </Card>
//                             </div>
//                             <div>
//                                 <Label>Стоимость проживания</Label>
//                                 <div className="flex gap-2 items-center justify-start">
//                                     <HousePlus />
//                                     <span className="text-2xl font-bold">{vacancyH?.homePrice}</span>
//                                 </div>
//                                 <Card className="mt-4 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
//                                     <Label className="font-semibold">Условия проживания</Label>
//                                     {vacancyH?.home_descr?.split(';').map((item: string, index: any) => (
//                                         <div key={index} className="flex gap-2 justify-start items-start my-1">
//                                             <CircleCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />{item}
//                                         </div>
//                                     ))}
//                                 </Card>
//                             </div>
//                         </div>
//                         <Image src={vacancyH?.imageFB || "/images/logo/logo-red.png"}
//                             alt={""} width={350} height={200}
//                             className="rounded-md max-h-max" />
//                     </div>

//                     {/* Описание работы */}
//                     <div>
//                         <div className="grid grid-cols-3 gap-10">
//                             <div className="col-span-2">
//                                 <Label className="text-xl font-bold my-2">О работе</Label>
//                                 {vacancyH?.work_descr?.split(';').map((item: string, index: any) => (
//                                     <div key={index} className="flex gap-2 justify-start items-start my-1">
//                                         <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Фото жилья */}
//                     {vacancyH?.homeImageFB && (
//                         <div>
//                             <Label className="text-xl font-bold my-2">Фото жилья</Label>
//                             <Carousel
//                                 orientation="horizontal"
//                                 opts={{
//                                     align: "center",
//                                     loop: true,
//                                 }}
//                                 className="w-full"
//                             >
//                                 <CarouselContent className="-ml-4 flex">
//                                     {vacancyH?.homeImageFB?.map((image: string, index: number) => (
//                                         <CarouselItem key={index} className="flex-shrink-0 md:w-1/4 pl-4 sm:w-1/2">
//                                             <div className="p-1">
//                                                 <Image
//                                                     src={image}
//                                                     alt={`Image ${index + 1}`}
//                                                     width={350}
//                                                     height={200}
//                                                     className="rounded-md max-h-max mx-auto"
//                                                 />
//                                             </div>
//                                         </CarouselItem>
//                                     ))}
//                                 </CarouselContent>
//                                 <CarouselPrevious type='button' className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
//                                     &lt;
//                                 </CarouselPrevious>
//                                 <CarouselNext type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
//                                     &gt;
//                                 </CarouselNext>
//                             </Carousel>
//                         </div>
//                     )}
//                 </CardContent>

//                 {/* Информация о партнере и кураторе */}
//                 <CardFooter className="flex flex-col items-start">
//                     <div className="flex gap-2 items-center">
//                         <Label className="my-2">Партнёр:</Label>
//                         <span className="font-semibold">{vacancyH?.partner?.companyName}</span>
//                     </div>
//                     <div className="flex gap-2 items-center">
//                         <Label className="my-2">Куратор:</Label>
//                         <span className="font-semibold">{vacancyH?.manager?.name}</span>
//                     </div>
//                 </CardFooter>
//                 <CandidateVacancy candidates={candidates}/>
//             </Card>
//         </div>
//     );
// };

// export default ViewVacancy;
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
import CandidateVacancy from '@/src/components/CandidateVacancy/CandidateVacancy'; // Импортируем новый компонент для кандидатов

const ViewVacancy = ({ vacancy }: any) => {
    const vacancyH = vacancy;

    // Логирование для отладки
    console.log("VACANCY", vacancyH);

    // Состояние для кандидатов и ошибок
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Функция для загрузки кандидатов с использованием useCallback
    const fetchCandidates = useCallback(async () => {
        if (!vacancyH) return; // Если вакансия не передана, не делаем запрос

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/candidates/forVacancy?vacancyId=${vacancyH._id}`);
            if (!response.ok) throw new Error(`Ошибка API: ${response.statusText}`);
            const data = await response.json();
            setCandidates(data.candidates || []); // Обновляем список кандидатов
        } catch (error) {
            setError('Ошибка при загрузке кандидатов');
            console.error('Ошибка при загрузке кандидатов:', error);
        } finally {
            setLoading(false);
        }
    }, [vacancyH]);

    // Загрузка кандидатов при изменении vacancyH
    useEffect(() => {
        fetchCandidates();
    }, [vacancyH, fetchCandidates]); // Используем fetchCandidates как зависимость

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
                            <BreadcrumbPage>{vacancyH?.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <CardContent>
                    {/* Контент вакансии */}
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
                                {vacancyH?.skills?.split(';').map((item: string, index: any) => (
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
                                    <span className="text-sm text-gray-600 ">НЕТТО</span>
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
                                    {vacancyH?.home_descr?.split(';').map((item: string, index: any) => (
                                        <div key={index} className="flex gap-2 justify-start items-start my-1">
                                            <CircleCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />{item}
                                        </div>
                                    ))}
                                </Card>
                            </div>
                        </div>
                        <Image src={vacancyH?.imageFB || "/images/logo/logo-red.png"}
                            alt={""} width={350} height={200}
                            className="rounded-md max-h-max" />
                    </div>

                    {/* Описание работы */}
                    <div>
                        <div className="grid grid-cols-3 gap-10">
                            <div className="col-span-2">
                                <Label className="text-xl font-bold my-2">О работе</Label>
                                {vacancyH?.work_descr?.split(';').map((item: string, index: any) => (
                                    <div key={index} className="flex gap-2 justify-start items-start my-1">
                                        <Minus className="w-5 h-5 mt-0.5 flex-shrink-0" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Фото жилья */}
                    {vacancyH?.homeImageFB && (
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
                                    {vacancyH?.homeImageFB?.map((image: string, index: number) => (
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

                {/* Информация о партнере и кураторе */}
                <CardFooter className="flex flex-col items-start">
                    <div className="flex gap-2 items-center">
                        <Label className="my-2">Партнёр:</Label>
                        <span className="font-semibold">{vacancyH?.partner?.companyName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Label className="my-2">Куратор:</Label>
                        <span className="font-semibold">{vacancyH?.manager?.name}</span>
                    </div>
                </CardFooter>
                <CandidateVacancy candidates={candidates} />
            </Card>
        </div>
    );
};

export default ViewVacancy;
