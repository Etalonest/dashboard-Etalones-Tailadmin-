'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CallHistory } from '../CallHistory/CallHistory';
import { Badge } from '@/components/ui/badge';
import RecruiterStage from './RecruiterStage/RecruiterStage';

export const FunnelCandidate = ({ onDataChange, candidate }: any) => {
  // Инициализация с дефолтными значениями
  const [funnel, setFunnel] = useState({
    presentation: true,
    viber: true,
    whatsapp: true,
    telegram: true,
    positive: true,
  });

  useEffect(() => {
    console.log("useEffect: candidate", candidate); // Логируем переданные данные кандидата
    if (candidate?.funnel) {
      console.log("Updating funnel state from candidate:", candidate.funnel); // Логируем, как обновляются данные
      setFunnel({
        presentation: candidate.funnel.presentation ?? false,
        viber: candidate.funnel.viber ?? false,
        whatsapp: candidate.funnel.whatsapp ?? true,
        telegram: candidate.funnel.telegram ?? false,
        positive: candidate.funnel.positive ?? false,
      });
    }
  }, [candidate]); // Следим за изменениями данных о кандидате

  // Когда данные в funnel изменяются, передаем их родителю
  useEffect(() => {
    console.log("useEffect: funnel updated", funnel); // Логируем изменения состояния funnel
    if (onDataChange) {
      onDataChange(funnel); // Передаем обновленное состояние родительскому компоненту
    }
  }, [funnel, onDataChange]);

  // Обработчик изменения состояния чекбокса
  const handleChange = (event: any) => {
    const { name, checked } = event.target;
    console.log(`handleChange triggered for ${name} with checked: ${checked}`); // Логируем имя чекбокса и его новое состояние
    setFunnel((prevState) => ({
      ...prevState,
      [name]: checked, // Обновляем только соответствующее поле
    }));
  };

  return (
    <>
    <Card className='p-2'>
      <CardContent className="flex flex-col items-start gap-2 p-2 pt-5">
        <div className="flex items-center space-x-2 w-full">
          <Checkbox
            id="presentation"
            name="presentation"
            checked={funnel.presentation}
            onChange={handleChange} />
          <label htmlFor="presentation" className="text-sm font-medium leading-none">
            Презентовал(а) компанию Etalones
          </label>
        </div>

        <div className="flex items-center space-x-2 w-full">
          <Checkbox
            id="viber"
            name="viber"
            checked={funnel.viber}
            onChange={handleChange} />
          <label htmlFor="viber" className="text-sm font-medium leading-none">
            Общаемся Viber
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="whatsapp"
            name="whatsapp"
            checked={funnel.whatsapp}
            onChange={handleChange} />
          <label htmlFor="whatsapp" className="text-sm font-medium leading-none">
            Общаемся WhatsApp
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="telegram"
            name="telegram"
            checked={funnel.telegram}
            onChange={handleChange} />
          <label htmlFor="telegram" className="text-sm font-medium leading-none">
            Общаемся Telegram
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="positive"
            name="positive"
            checked={funnel.positive}
            onChange={handleChange} />
          <label htmlFor="positive" className="text-sm font-medium leading-none">
            Положительное впечатление
          </label>
        </div>
      </CardContent>
    </Card>
      // времено для интерфэйса и идеи
      <RecruiterStage/>
      </>
  );
};

// 'use client'
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { CallHistory } from '../CallHistory/CallHistory';

// export const FunnelCandidate = ({ onDataChange, initialData, candidate }: any) => {
//  const [funnel, setFunnel] = useState(
//     {
//      presentation: candidate?.funel?.presentation,
//      viber: candidate?.funel?.viber,
//      whatsapp: true,
//      telegram: candidate?.funel?.telegram,
//      positive: false,
//      name: true,
//      phone: true,
//      age: true,
//      citizenship: true,
//      professions: true,
//      location: true,
//      noFearOfPaidHousing: false,
//      readyFor200Hours: false,
//      hasExperienceInEurope: false,
//      hasPartner: false,
//      hasEuroCard: false,
//      hasPesel: false,
//      sharesContent: false,});

//  useEffect(() => {
//      if (candidate) {
//        setFunnel(prevFunnel => ({
//          ...prevFunnel, // Сохраняем все старые значения
//          viber: candidate.viber, 
//          whatsapp: candidate.whatsapp,
//          telegram: candidate.telegram,
//        }));
//      }
//      console.log("DATA", candidate.funnel)
//    }, [candidate]);
//   const handleChange = (event: any) => {
//     const { name, checked } = event.target;
//     setFunnel((prevState) => ({
//       ...prevState,
//       [name]: checked,
//     }));
//   };

//   return (
//     <>
//       <Card>
//         <CallHistory candidate={candidate} />
//         <CardContent className="flex flex-col gap-4">
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="presentation"
//               checked={funnel.presentation} 
//               onChange={handleChange}  />
//             <label htmlFor="presentation" className="text-sm font-medium leading-none">
//               Презентовал(а) компанию Etalones
//             </label>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="viber"
//               checked={funnel.viber} 
//               onChange={handleChange} />
//             <label htmlFor="viber" className="text-sm font-medium leading-none">
//               Общаемся Viber
//             </label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="whatsapp"
//               checked={funnel.whatsapp} 
//               onChange={handleChange} />
//             <label htmlFor="whatsapp" className="text-sm font-medium leading-none">
//               Общаемся WhatsApp
//             </label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="telegram"
//               checked={funnel.telegram} 
//               onChange={handleChange} />
//             <label htmlFor="telegram" className="text-sm font-medium leading-none">
//               Общаемся Telegram
//             </label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="positive"
//               checked={funnel.positive} 
//               onChange={handleChange} />
//             <label htmlFor="positive" className="text-sm font-medium leading-none">
//               Положительное впечатление
//             </label>
//           </div>
//         </CardContent>
//       </Card>
      
//     </>
//   );
// };


{/* <form onSubmit={handleSubmit}>
        <Card>
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="flex justify-between m-2">
              <span>2. Сбор анкеты</span> <Badge className="text-green-800">90%</Badge>
            </CardTitle>
            <CardContent className="flex flex-col gap-2 items-start justify-around">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="name"
                  checked={formData?.firstDialog?.name}
                  onChange={() => handleCheckboxChange('firstDialog', 'name')} />
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Имя
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phone"
                  checked={formData?.firstDialog?.phone}
                  onChange={() => handleCheckboxChange('firstDialog', 'phone')} />
                <label htmlFor="phone" className="text-sm font-medium leading-none">
                  Телефон
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="age"
                  checked={formData?.firstDialog?.age}
                  onChange={() => handleCheckboxChange('firstDialog', 'age')} />
                <label htmlFor="age" className="text-sm font-medium leading-none">
                  Возраст
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="citizenship"
                  checked={formData?.firstDialog?.citizenship}
                  onChange={() => handleCheckboxChange('firstDialog', 'citizenship')} />
                <label htmlFor="citizenship" className="text-sm font-medium leading-none">
                  Местоположение
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="professions"
                  checked={formData?.firstDialog?.professions}
                  onChange={() => handleCheckboxChange('firstDialog', 'professions')} />
                <label htmlFor="professions" className="text-sm font-medium leading-none">
                  Профессии
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documents"
                  checked={formData?.firstDialog?.documents}
                  onChange={() => handleCheckboxChange('firstDialog', 'documents')} />
                <label htmlFor="documents" className="text-sm font-medium leading-none">
                  Документы на словах
                </label>
              </div>
            </CardContent>
          </div>
        </Card>

        <Button type="submit" variant="outline" className="mt-4">
          Отправить
        </Button>
      </form> */}