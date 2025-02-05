'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { CirclePlus, HandCoins, HousePlus, MapPinned, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TransferToKurator = ({ selectedProfessions }: any) => {
    const [filteredVacancies, setFilteredVacancies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [vacanciesCache, setVacanciesCache] = useState<any[]>([]); // Кэш вакансий

    useEffect(() => {
        if (!selectedProfessions || selectedProfessions.length === 0) return;

        const fetchVacancies = async () => {
            setLoading(true);
            try {
                // Формируем строку с массивом профессий для передачи в API
                const queryParam = selectedProfessions.join(",");
                
                // Проверяем, есть ли кэшированные вакансии
                if (vacanciesCache.length === 0) {
                    const response = await fetch(`/api/vacancy?professionNames=${queryParam}`);
                    const data = await response.json();

                    if (response.ok) {
                        setVacanciesCache(data); // Кэшируем данные
                        setFilteredVacancies(data);
                    } else {
                        console.error("Ошибка при получении вакансий:", data);
                        setFilteredVacancies([]);
                    }
                } else {
                    // Если данные уже есть в кэше, фильтруем по выбранным профессиям
                    const filteredData = vacanciesCache.filter((vacancy) =>
                        selectedProfessions.some((profession: string) =>
                            vacancy.title.toLowerCase().includes(profession.toLowerCase())
                        )
                    );
                    setFilteredVacancies(filteredData);
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
                setFilteredVacancies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, [selectedProfessions, vacanciesCache]); // Кэш вакансий зависит от профессий

    return (
        <div>
            <Card className="p-2 w-max">
                <CardHeader>
                    <CardTitle>
                        <span>Подходящие вакансии:</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-2 p-2 pt-5 w-max">
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : filteredVacancies.length === 0 ? (
                        <div>Нет подходящих вакансий</div>
                    ) : (
                        filteredVacancies.map((vacancy, index) => (
                            <div key={index} className="grid grid-cols-2 gap-5">
                                <Card className="rounded-md p-2 w-full">
                                    <CardContent className="w-full">
                                        <div className="text-xl font-bold">{vacancy.title}</div>
                                        <div className="text-sm text-gray-600 flex gap-2 items-center">
                                            <span><MapPinned /></span>
                                            <span>{vacancy.location}</span>
                                        </div>
                                        <div className="flex gap-2 items-center justify-start">
                                            <HandCoins />
                                            <span className="font-bold">{vacancy.salary}</span>
                                            <span className="text-sm text-gray-600">НЕТТО</span>
                                        </div>
                                        <div className="flex gap-2 items-center justify-start">
                                            <HousePlus />
                                            <span className="font-bold">{vacancy.homePrice}</span>
                                        </div>
                                    </CardContent>
                                    <div className="flex gap-2 items-center justify-end">
                                        <span className="text-sm font-semibold">Куратор:</span>
                                        <span className="text-sm">{vacancy.manager?.name}</span>
                                    </div>
                                </Card>
                                <div className="flex flex-col items-start h-full">
                                    <Link href={`/vacancy/${vacancy._id}`} passHref target="blank">
                                        <Button className="w-full bg-slate-100 text-black hover:bg-slate-200 mt-8">Посмотреть вакансию</Button>
                                    </Link>
                                    <Button className="w-full bg-slate-100 text-black hover:bg-slate-200 mt-8">Заитнересовала вакансия</Button>
                                    <Drawer>
    <DrawerTrigger>
    <Button className="w-full bg-slate-100 text-black hover:bg-slate-200 mt-8">Передать куратору</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
      
        </DrawerTitle>
        <DrawerDescription className='text-gray-400'>Выберите какой документ вы хотите добавить</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter >
            <div className='flex gap-2 items-center justify-center'>
            <Button>Загрузить</Button>
            <Button>Скачать</Button>
            </div>
            <DrawerClose className='absolute top-2 right-2'>
             <X size={18} color="red"/>
            </DrawerClose>
          </DrawerFooter>
    </DrawerContent>
  </Drawer>
                                </div>
                            </div>
                            
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TransferToKurator;
