'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, HousePlus, MapPinned } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SuitableV = ({ selectedProfessions }: any) => {
    const [filteredVacancies, setFilteredVacancies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedProfessions || selectedProfessions.length === 0) return;

        const fetchVacancies = async () => {
            setLoading(true);
            try {
                // Формируем строку с массивом профессий для передачи в API
                const queryParam = selectedProfessions.join(",");
                const response = await fetch(`/api/vacancy?professionNames=${queryParam}`);
                const data = await response.json();

                if (response.ok) {
                    setFilteredVacancies(data);
                } else {
                    console.error("Ошибка при получении вакансий:", data);
                    setFilteredVacancies([]);
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
                setFilteredVacancies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, [selectedProfessions]);

    return (
        <div>
            <Card className="p-2">
                <CardHeader>
                    <CardTitle>
                        <span>Подходящие вакансии:</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-2 p-2 pt-5">
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : filteredVacancies.length === 0 ? (
                        <div>Нет подходящих вакансий</div>
                    ) : (
                        filteredVacancies.map((vacancy, index) => (
                            <Link key={index} href={`/vacancy/${vacancy._id}`} passHref target="blank">
                                <Card className="rounded-md p-2 w-full cursor-pointer">
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
                            </Link>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SuitableV;
