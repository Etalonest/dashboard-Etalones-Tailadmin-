'use client'
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useManager } from "@/src/context/ManagerContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "@/src/context/SessionContext";
import { PartnersStage } from "@/src/types/manager";
import { Checkbox } from "@/components/ui/checkbox";

export default function Setting() {
    const { session } = useSession();
    const managerId = session?.managerId;
    const { partnersStage, manager, isLoading, error } = useManager();
    const type = 'all';

    console.log('Тип, полученный из URL (фиксирован на all):', type);

    // Маппинг типов для стадий
    const typeKeyMap: Record<string, string> = {
        all: 'all', // Здесь у нас фиксированное значение
    };

    const stageKey = typeKeyMap[type] || 'all';

    console.log('Тип выбранной стадии:', stageKey);

    // Логируем данные, полученные из контекста

    const handleCheckboxChange = async (partnerId: string, stage: string, checked: boolean) => {
        if (!managerId) {
            alert("Менеджер не найден");
            return;
        }

        try {
            const response = await fetch(`/api/manager/${managerId}/partners`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partnerId,
                    stage,
                    checked,
                }),
            });

            if (response.ok) {
                alert("Статус обновлён");
            } else {
                alert("Ошибка при обновлении статуса");
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            alert("Ошибка при обновлении статуса");
        }
    };

    if (isLoading) return <div className="p-6 text-center">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-500">Ошибка: {error}</div>;

    const allStageKeys = ['all', 'peopleOnObj', 'checkPeople', 'waitContract', 'oneCall'];

    // Собираем всех партнёров по стадиям
    const allPartnersMap: Record<string, any> = {};

    partnersStage?.forEach(stageObj => {
        allStageKeys.forEach(stageKey => {
            const partners = stageObj?.[stageKey as keyof PartnersStage] || [];
            partners.forEach((partner: any) => {
                const id = partner._id || partner.companyName; // Лучше по id, если есть
                if (!allPartnersMap[id]) {
                    allPartnersMap[id] = {
                        ...partner,
                        stages: {},
                    };
                }
                allPartnersMap[id].stages[stageKey] = true;
            });
        });
    });

    // Получаем итоговый список партнёров
    const uniquePartners = Object.values(allPartnersMap);

    return (
        <div className="p-6">
            <Breadcrumb pageName="Настройки" />
            {manager?.partners?.length === 0 ? (
                <div className="text-center text-gray-500">Нет партнёров для этой стадии</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Имя</TableHead>
                            <TableHead>
                                Все 
                            </TableHead>
                            <TableHead>
                                Люди на объекте
                            </TableHead>
                            <TableHead>
                                Ищем специалиста
                            </TableHead>
                            <TableHead>
                                Контракт на подписи
                            </TableHead>
                            <TableHead>
                                На стадии переговоров
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {uniquePartners.map((partner: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{partner.companyName || partner.name}</TableCell>
                                {allStageKeys.map((key) => (
                                    <TableCell key={key}>
                                        <Checkbox
                                            checked={!!partner.stages[key]}
                                            // onCheckedChange={(checked) => handleCheckboxChange(partner._id, key, checked)}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
