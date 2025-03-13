'use client'
import { v4 as uuidv4Original } from 'uuid';
import { useSession } from '@/src/context/SessionContext';
import { useNotifications } from '@/src/context/NotificationContext';
import { CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CallHistoryProps {
  candidate: any;
}

export function CallHistory({ candidate }: CallHistoryProps) {
  const { addNotification } = useNotifications();
  const { session } = useSession();  
  const author = session?.user?.name || 'Неизвестный пользователь'; 
  const dialogs = candidate?.dialogs || [];
  const totalCalls = dialogs.length;
  const successfulCalls = dialogs.filter((dialog: any) => dialog.text === 'Дозвонился').length;
  const noSuccessfulCalls = dialogs.filter((dialog: any) => dialog.text === 'Не дозвонился');
  const answeredPercentage = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

  const lastCall = dialogs[dialogs.length - 1];
  
  const candidateId = candidate?._id;

  // Состояние для последнего звонка
  const [currentCallStatus, setCurrentCallStatus] = useState<string | null>(null);
  const [currentCallDate, setCurrentCallDate] = useState<string | null>(null);
  const [lastCallComment, setLastCallComment] = useState<string | null>(null);
  const [lastCallAuthor, setLastCallAuthor] = useState<string | null>(null);

  // Состояние для открытия диалога
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState<string>("");

  // Эффект для загрузки последнего звонка после монтирования компонента
  useEffect(() => {
    if (lastCall) {
      setCurrentCallStatus(lastCall.text);
      setCurrentCallDate(lastCall.date);
      setLastCallComment(lastCall.comment || null);
      setLastCallAuthor(lastCall.author || 'Неизвестный пользователь');
    }
  }, [lastCall]);

  // Обработчик звонка
  const handleCall = async (status: 'Дозвонился' | 'Не дозвонился') => {
    if (status === 'Дозвонился') {
      // Если нажали "Дозвонился", то открываем диалог для ввода комментария
      setIsDialogOpen(true);
    } else {
      // Обрабатываем звонок "Не дозвонился"
      const newRecord = {
        candidateId,
        author,
        status,
        date: new Date().toLocaleString(),
      };

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
        if (data.message === 'Звонок успешно записан') {
          // Обновляем состояние локально
          setCurrentCallStatus(status);
          setCurrentCallDate(new Date().toLocaleString());

          addNotification({
            title: "Записано",
            type: "success",
            id: uuidv4Original(),
          });
        }
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error);
      }
    }
  };

  // Сохранение комментария и статуса
  const handleSaveComment = async () => {
    const newRecord = {
      candidateId,
      author,
      status: "Дозвонился", // Всегда "Дозвонился", так как комментарий добавляется только после успешного звонка
      comment,
      date: new Date().toLocaleString(),
    };

    try {
      const response = await fetch('/api/callHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          author,
          status: 'Дозвонился',
          comment,
        }),
      });

      const data = await response.json();
      if (data.message === 'Звонок успешно записан') {
        // Обновляем состояние локально
        setCurrentCallStatus('Дозвонился');
        setCurrentCallDate(new Date().toLocaleString());
        setComment(""); // Сбрасываем комментарий
        setIsDialogOpen(false); // Закрываем диалог

        addNotification({
          title: "Записано",
          type: "success",
          id: uuidv4Original(),
        });
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  return (
    <div>
      <CardTitle className="flex justify-between m-2">
        <Dialog >
          <DialogTrigger asChild>
            <Badge className="text-green-800 bg-slate-100 text-sm hover:text-white p-2">
              {totalCalls}<Phone size={16}/> 
            </Badge> 
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1025px] fixed top-5 right-0">
            <DialogHeader>
              <DialogTitle>Данные о звонках</DialogTitle>
              <DialogDescription>
                История выполненых звонков
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-100 p-2">
              {candidate?.dialogs.map((dialog: any, index: number) => (
                <div key={index} className="flex gap-2 justify-start items-start mt-1 relative">
                  <Badge className="text-green-800 bg-slate-100 text-sm hover:text-white p-2">
                    {new Date(dialog.date).toLocaleString().slice(0, 5)}.
                    {new Date(dialog.date).getFullYear().toString().slice(-2)}-
                    {new Date(dialog.date).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Badge>
                  <p>{dialog?.author}</p>
                  <p>{dialog.text}</p>
                  <p>{dialog?.comment}</p>
                </div>
              ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Badge className="text-green-800 bg-slate-100 text-sm hover:text-white p-2">
          {answeredPercentage.toFixed(2)}%
        </Badge>
      </CardTitle>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-around">
          {/* Кнопка "Дозвонился" */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`p-2 bg-green-800 hover:bg-green-500 text-white ${currentCallStatus === 'Дозвонился' ? 'bg-green-500' : ''}`}
                  onClick={() => handleCall('Дозвонился')}
                >
                  Дозвонился
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='flex gap-2 pt-0'>
                <p>
                  {currentCallDate ? 
                    new Date(currentCallDate).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) 
                    : 'Нет данных о звонке'}
                </p>
                {lastCallComment && <p>Комментарий: {lastCallComment}</p>}
                {lastCallAuthor && <p>Автор: {lastCallAuthor}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Кнопка "Не дозвонился" */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`p-2 bg-red-800 hover:bg-red-500 text-white ${currentCallStatus === 'Не дозвонился' ? 'bg-red-500' : ''}`}
                  onClick={() => handleCall('Не дозвонился')}
                >
                  Не дозвонился
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='flex gap-2 pt-0'>
                {noSuccessfulCalls.length > 0 && (
                  <>
                    <p>
                      {new Date(noSuccessfulCalls[noSuccessfulCalls.length - 1].date).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {noSuccessfulCalls.length > 0 && noSuccessfulCalls[noSuccessfulCalls.length - 1].comment && (
  <p>Комментарий: {noSuccessfulCalls[noSuccessfulCalls.length - 1].comment}</p>
)}                    <p>Автор: {noSuccessfulCalls[noSuccessfulCalls.length - 1].author || 'Неизвестный пользователь'}</p>
                  </>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>

      {/* Диалог для комментариев */}
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogContent className='h-max p-5 top-0 bottom-0'>
            <DialogHeader>
              <DialogTitle>Добавить комментарий</DialogTitle>
              <DialogDescription>Напишите комментарий к звонку, что вы узнали нового или о чём договорились:</DialogDescription>
            </DialogHeader>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              className="w-full p-2" 
              placeholder="Введите комментарий..."
            />
            <DialogFooter>
              <Button onClick={handleSaveComment}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

