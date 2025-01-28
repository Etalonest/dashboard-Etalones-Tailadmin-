
'use client'

import React, { useState, useEffect } from 'react';
import { CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
interface CallHistoryProps {
  candidate: any;
}

export function CallHistory({ candidate }: CallHistoryProps) {
  const { data: session } = useSession();  
  const author = session?.user?.name || 'Неизвестный пользователь'; 
  const dialogs = candidate?.dialogs || [];
  const totalCalls = dialogs.length;
  const successfulCalls = dialogs.filter((dialog: any) => dialog.text === 'Дозвонился').length;
  const answeredPercentage = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

  const lastCall = dialogs[dialogs.length - 1];
  const isLastCallAnswered = lastCall?.text === 'Дозвонился';
  const isLastCallMissed = lastCall?.text === 'Не дозвонился';
  
  const candidateId = candidate?._id;

  // Обработчик для записи нового звонка
  const handleCall = async (status: 'Дозвонился' | 'Не дозвонился') => {
    const newRecord = {
      candidateId,
      author,
      status,
      date: new Date().toLocaleString(),
    };

    // // Добавляем новый звонок в историю звонков
    // setCallHistory((prevHistory) => {
    //   const updatedHistory = [...prevHistory, newRecord];
    //   return updatedHistory;
    // });

    try {
      const response = await fetch('/api/callHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          author,
          status,
        }),
      });

      const data = await response.json();
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  

  return (
    <div>
      <CardTitle className="flex justify-between m-2">
        <span>1. Диалог</span> 
        <Badge className="text-green-800">Дозвоны - {answeredPercentage.toFixed(2)}%</Badge>
      </CardTitle>
      
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-around">
          {/* Кнопка "Дозвонился" */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`bg-green-800 hover:bg-green-500 text-white ${isLastCallAnswered ? 'bg-green-500' : ''}`}
                  onClick={() => handleCall('Дозвонился')}
                >
                  Дозвонился
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
              <p>
  {lastCall ? 
    new Date(lastCall?.date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) 
    : 'Нет данных о звонке'
  }
</p>-
<span>{lastCall?.author}</span>

              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Кнопка "Не дозвонился" */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`bg-red-800 hover:bg-red-500 text-white ${isLastCallMissed ? 'bg-red-500' : ''}`}
                  onClick={() => handleCall('Не дозвонился')}
                >
                  Не дозвонился
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom' >
              <p>
  {lastCall ? 
    new Date(lastCall?.date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) 
    : 'Нет данных о звонке'
  }
</p>
<span>{lastCall?.author}</span>

              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </div>
  );
}
