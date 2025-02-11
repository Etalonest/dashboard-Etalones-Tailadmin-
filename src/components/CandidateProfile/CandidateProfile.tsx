'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";  
import usePushNotification from '@/src/hooks/usePushNotification';


const CandidateProfile = () => {
    usePushNotification();

    const { id } = useParams();  
    
    const [candidate, setCandidate] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/candidates/${id}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных кандидата');
                }
                const data = await response.json();
                setCandidate(data.candidate);
            } catch (error) {
                console.error('Ошибка при запросе данных кандидата:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCandidate();
        }
    }, [id]);  // Загружаем данные кандидата при изменении id

    return (
        <div className="mx-auto max-w-screen-xl">
            <h1 className="text-3xl font-bold">Профиль кандидата</h1>
            <div className="mt-5">
                {loading ? (
                    <p>Загрузка...</p>
                ) : candidate ? (
                    <Card className="p-4">
                        <CardHeader>
                            <CardTitle>{candidate.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{candidate.phone}</p>
                            <div>
                                <strong>Менеджер:</strong> {candidate.manager?.name || 'Не указан'}
                            </div>
                            {/* Добавьте другие данные кандидата, например, вакансии, задачи и т.д. */}
                        </CardContent>
                    </Card>
                ) : (
                    <p>Кандидат не найден</p>
                )}
            </div>
        </div>
    );
};

export default CandidateProfile;
