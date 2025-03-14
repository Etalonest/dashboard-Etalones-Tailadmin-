// 'use client';
// import { v4 as uuidv4Original } from 'uuid';
// import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
// import { Button } from "@/components/ui/button";
// import { useNotifications } from "@/src/context/NotificationContext";
// import { useSession } from "@/src/context/SessionContext";
// import { useState, useEffect } from "react";
// import { Candidate } from '@/src/types/candidate';

// const InterviewRes = ({ candidate }: { candidate: Candidate }) => {
//   const { addNotification } = useNotifications();
//   const { session } = useSession();
//   const author = session?.user?.name || 'Неизвестный пользователь';
//   const id = candidate._id;

//   // Состояние для отображения текущего интервью
//   const [currentInterview, setCurrentInterview] = useState<any>(null); // Текущее интервью
//   const [currentInterviewStatus, setCurrentInterviewStatus] = useState<string>(''); // Статус текущего интервью

//   useEffect(() => {
//     if (candidate && candidate.interviews && candidate.interviews.length > 0) {
//       const interview = candidate?.interviews[0]; // Берем первое интервью
//       setCurrentInterview(interview);
//       setCurrentInterviewStatus(interview.status); // Устанавливаем статус
//     }
//   }, [candidate]);

//   // Обработчик статуса интервью (Прошёл / Не прошёл)
//   const handleInterviewStatusChange = async (status: 'Прошёл' | 'Не прошёл') => {
//     if (!currentInterview) return;

//     try {
//       // Отправка запроса на сервер для обновления статуса интервью
//       const response = await fetch(`/api/candidates/${id}/stages/partner/updateInterviewStatus`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           interviewId: currentInterview._id, 
//           status, 
//           author,
//         }),
//       });

//       const data = await response.json();
//       if (data.message === 'Статус интервью обновлен') {
//         // Обновление локального состояния
//         setCurrentInterviewStatus(status);

//         addNotification({
//           title: `Статус изменен на "${status}"`,
//           type: "success",
//           id: uuidv4Original(),
//         });
//       }
//     } catch (error) {
//       console.error('Ошибка при обновлении статуса интервью:', error);
//       addNotification({
//         title: "Ошибка",
//         message: "Не удалось обновить статус интервью.",
//         type: "error",
//         id: uuidv4Original(),
//       });
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center justify-around">
//           {/* Кнопка "Прошёл" */}
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={`p-2 bg-green-800 hover:bg-green-500 text-white ${currentInterviewStatus === 'Прошёл' ? 'bg-green-500' : ''}`}
//                   onClick={() => handleInterviewStatusChange('Прошёл')}
//                 >
//                   Прошёл
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="bottom" className="flex gap-2 pt-0">
//                 {currentInterviewStatus === 'Прошёл' && (
//                   <p>{new Date(currentInterview.date).toLocaleString()}</p>
//                 )}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           {/* Кнопка "Не прошёл" */}
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={`p-2 bg-red-800 hover:bg-red-500 text-white ${currentInterviewStatus === 'Не прошёл' ? 'bg-red-500' : ''}`}
//                   onClick={() => handleInterviewStatusChange('Не прошёл')}
//                 >
//                   Не прошёл
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="bottom" className="flex gap-2 pt-0">
//                 {currentInterviewStatus === 'Не прошёл' && (
//                   <p>{new Date(currentInterview.date).toLocaleString()}</p>
//                 )}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewRes;
'use client';
import { v4 as uuidv4Original } from 'uuid';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/src/context/NotificationContext";
import { useSession } from "@/src/context/SessionContext";
import { useState, useEffect } from "react";
import { Candidate } from '@/src/types/candidate';

const InterviewRes = ({ candidate }: { candidate: Candidate }) => {
  const { addNotification } = useNotifications();
  const { session } = useSession();
  const author = session?.user?.name || 'Неизвестный пользователь';
  const id = candidate._id;

  // Состояние для отображения текущего интервью
  const [currentInterview, setCurrentInterview] = useState<any>(null); // Текущее интервью
  const [currentInterviewStatus, setCurrentInterviewStatus] = useState<string>(''); // Статус текущего интервью
  const [showDialog, setShowDialog] = useState<boolean>(false); // Для отображения диалога
  const [dialogStatus, setDialogStatus] = useState<'Прошёл' | 'Не прошёл' | null>(null); // Для определения, какой диалог показывать
  const [comment, setComment] = useState<string>(''); // Состояние комментария
  const [departureDate, setDepartureDate] = useState<string>(''); // Состояние для даты выезда (если "Прошёл")
  
  useEffect(() => {
    if (candidate && candidate.interviews && candidate.interviews.length > 0) {
      const interview = candidate?.interviews[0]; // Берем первое интервью
      setCurrentInterview(interview);
      setCurrentInterviewStatus(interview.status); // Устанавливаем статус
    }
  }, [candidate]);

  // Обработчик статуса интервью (Прошёл / Не прошёл)
  const handleInterviewStatusChange = async (status: 'Прошёл' | 'Не прошёл') => {
    if (!currentInterview) return;

    setDialogStatus(status);
    setShowDialog(true); // Открываем диалог при изменении статуса
  };

  // Обработчик отправки данных из диалогового окна
  const handleDialogSubmit = async () => {
    if (dialogStatus === 'Прошёл' && !departureDate) {
      addNotification({
        title: "Ошибка",
        message: "Необходимо выбрать дату выезда.",
        type: "error",
        id: uuidv4Original(),
      });
      return;
    }
    if (dialogStatus === 'Не прошёл' && !comment) {
      addNotification({
        title: "Ошибка",
        message: "Необходимо указать причину, почему кандидат не прошёл.",
        type: "error",
        id: uuidv4Original(),
      });
      return;
    }

    try {
      const body = {
        interviewId: currentInterview._id,
        status: dialogStatus,
        author,
        comment,
        departureDate: dialogStatus === 'Прошёл' ? departureDate : null, // Отправляем дату выезда только если статус "Прошёл"
      };

      // Отправка запроса на сервер для обновления статуса интервью
      const response = await fetch(`/api/candidates/${id}/stages/partner/updateInterviewStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.message === 'Статус интервью обновлен') {
        // Обновление локального состояния
        if (dialogStatus !== null) {
          setCurrentInterviewStatus(dialogStatus); // Только если dialogStatus не null
        }

        addNotification({
          title: `Статус изменен на "${dialogStatus}"`,
          type: "success",
          id: uuidv4Original(),
        });
      } else {
        addNotification({
          title: "Ошибка",
          message: "Не удалось обновить статус интервью.",
          type: "error",
          id: uuidv4Original(),
        });
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса интервью:', error);
      addNotification({
        title: "Ошибка",
        message: "Не удалось обновить статус интервью.",
        type: "error",
        id: uuidv4Original(),
      });
    }

    // Закрытие диалога
    setShowDialog(false);
    setComment('');
    setDepartureDate('');
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-around">
          {/* Кнопка "Прошёл" */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`p-2 bg-green-800 hover:bg-green-500 text-white ${currentInterviewStatus === 'Прошёл' ? 'bg-green-500' : ''}`}
                  onClick={() => handleInterviewStatusChange('Прошёл')}
                >
                  Прошёл
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex gap-2 pt-0">
                {currentInterviewStatus === 'Прошёл' && (
                  <p>{new Date(currentInterview.date).toLocaleString()}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Кнопка "Не прошёл" */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`p-2 bg-red-800 hover:bg-red-500 text-white ${currentInterviewStatus === 'Не прошёл' ? 'bg-red-500' : ''}`}
                  onClick={() => handleInterviewStatusChange('Не прошёл')}
                >
                  Не прошёл
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex gap-2 pt-0">
                {currentInterviewStatus === 'Не прошёл' && (
                  <p>{new Date(currentInterview.date).toLocaleString()}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Диалоговое окно для комментариев */}
      {showDialog && dialogStatus && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl mb-2">{`Комментарий для статуса "${dialogStatus}"`}</h2>
            {dialogStatus === 'Прошёл' ? (
              <>
                {/* Поле для выбора даты выезда */}
                <label htmlFor="departureDate" className="block">Дата выезда</label>
                <input
                  type="date"
                  id="departureDate"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                />
                {/* Опциональный комментарий */}
                <label htmlFor="comment" className="block">Комментарий (опционально)</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="w-full p-2 border rounded-md"
                  placeholder="Введите комментарий..."
                />
              </>
            ) : (
              <>
                {/* Обязательный комментарий для "Не прошёл" */}
                <label htmlFor="comment" className="block">Причина, почему не прошёл</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="w-full p-2 border rounded-md"
                  placeholder="Введите причину..."
                />
              </>
            )}
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                className="bg-gray-400 text-white"
                onClick={() => setShowDialog(false)}
              >
                Отмена
              </Button>
              <Button
                variant="outline"
                className="bg-blue-500 text-white"
                onClick={handleDialogSubmit}
              >
                Отправить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRes;
