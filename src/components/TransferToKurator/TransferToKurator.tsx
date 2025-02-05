'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HandCoins, HousePlus, MapPinned, OctagonAlert, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TransferToKurator = ({ selectedProfessions, candidate }: any) => {
    const [filteredVacancies, setFilteredVacancies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [vacanciesCache, setVacanciesCache] = useState<any[]>([]); 

    const [selectedVacancy, setSelectedVacancy] = useState<any | null>(null); // Состояние для выбранной вакансии
    const [comment, setComment] = useState<string>(''); // Для комментария

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
    }, [selectedProfessions, vacanciesCache]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!selectedVacancy || !comment) {
            alert("Пожалуйста, выберите вакансию и добавьте комментарий.");
            return;
        }
    
        // Создаем объект FormData
        const formData = new FormData();
        formData.append('status', 'in-progress'); // Статус
        formData.append('responsible', selectedVacancy.manager._id); // Менеджер вакансии
        formData.append('comment', comment); // Комментарий
        formData.append('vacancy', selectedVacancy._id); // ID вакансии
        formData.append('candidateId', candidate._id); // ID кандидата
    
        try {
            const response = await fetch(`/api/candidates/${candidate._id}/stages/curator`, {
                method: 'POST',
                body: formData, // Отправляем formData
            });
    
            const data = await response.json();
            if (data.message) {
                alert('Кандидат успешно передан куратору!');
            } else {
                alert('Ошибка при передаче кандидата.');
            }
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            alert('Ошибка при отправке данных.');
        }
    };
    

    const handleSelectVacancy = (vacancy: any) => {
        setSelectedVacancy(vacancy); // Сохраняем выбранную вакансию
    };

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
                                    <Drawer>
                                        <DrawerTrigger>
                                            <Button className="w-full bg-slate-100 text-black hover:bg-slate-200 mt-8" onClick={() => handleSelectVacancy(vacancy)}>
                                                Передать куратору
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent className="bg-black text-white h-[50%]">
                                            <form onSubmit={handleSubmit}>
                                                <DrawerHeader className="flex flex-col items-start justify-center">
                                                    <DrawerTitle className="flex justify-between items-center w-full">
                                                        <div>
                                                            <div>Передать куратору <span className="underline">{candidate.name}</span> на вакансию <span className="underline">{vacancy.title}</span> в городе <span className="underline">{vacancy.location}</span></div>
                                                        </div>
                                                        <Button className="bg-slate-100 text-black hover:bg-slate-200">Отправить</Button>
                                                    </DrawerTitle>
                                                    <DrawerDescription className="text-yellow-400 flex gap-2">
                                                        <OctagonAlert />
                                                        Убедитесь в достоверности данных кандидата
                                                    </DrawerDescription>
                                                </DrawerHeader>
                                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                                    <Label>Комментарий:</Label>
                                                    <Textarea
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        placeholder="Оставьте свой комментарий"
                                                        className="w-[50%] h-full bg-slate-100 text-black"
                                                    />
                                                </div>
                                                <DrawerClose className="absolute top-2 right-2">
                                                    <X size={18} color="red" />
                                                </DrawerClose>
                                            </form>
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
