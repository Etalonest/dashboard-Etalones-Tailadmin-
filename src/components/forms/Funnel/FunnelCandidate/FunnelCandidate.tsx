'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CallHistory } from '../CallHistory/CallHistory';

export const FunnelCandidate = ({ onDataChange, initialData, candidate }: any) => {
  const [formData, setFormData] = useState(initialData || {
    firstDialog: {
      presentation: false,
      viber: true,
      whatsapp: true,
      telegram: false,
    },
    anketa: {
      name: true,
      phone: true,
      age: true,
      citizenship: true,
      professions: true,
      viber: true,
      telegram: true,
      whatsapp: true,
      location: true,
    },

    negotiationProcess: {
      noFearOfPaidHousing: false,
      readyFor200Hours: false,
      hasExperienceInEurope: false,
      hasPartner: false,
      hasEuroCard: false,
      hasPesel: false,
      sharesContent: false,
    },
  });

  // Хэндлер изменения состояния чекбоксов
  const handleCheckboxChange = (section: string, field: string) => {
    setFormData((prevState: any) => {
      const newFormData = { ...prevState }; // Копируем старое состояние
      newFormData[section][field] = !newFormData[section][field]; // Инвертируем значение для этого чекбокса
  
      // Важно: передаем обновленные данные родителю
      if (onDataChange) {
        onDataChange(newFormData);
      }
  
      return newFormData; // Возвращаем обновленное состояние
    });
  };
  

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (onDataChange) {
      onDataChange(formData);
    }

    console.log("Форма отправлена с данными:", formData);
  };
  return (
    <>
      <Card>
      
         <CallHistory candidate={candidate} />
         
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="presentation"
              checked={formData.firstDialog.presentation}
              onChange={() => handleCheckboxChange('firstDialog', 'precentation')} />
            <label htmlFor="presentation" className="text-sm font-medium leading-none">
              Презентовал(а) компанию Etalones
            </label>
          </div>
 

          <div className="flex items-center space-x-2">
            <Checkbox
              id="viber"
              checked={formData.firstDialog.viber}
              onChange={() => handleCheckboxChange('firstDialog', 'viber')} />
            <label htmlFor="viber" className="text-sm font-medium leading-none">
              Общаемся Viber
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsapp"
              checked={formData.firstDialog.whatsapp}
              onChange={() => handleCheckboxChange('firstDialog', 'whatsapp')} />
            <label htmlFor="whatsapp" className="text-sm font-medium leading-none">
              Общаемся WhatsApp
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="telegram"
              checked={formData.firstDialog.telegram}
              onChange={() => handleCheckboxChange('firstDialog', 'telegram')} />
            <label htmlFor="telegram" className="text-sm font-medium leading-none">
              Общаемся Telegram
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="positive"
              checked={formData.firstDialog.positive}
              onChange={() => handleCheckboxChange('firstDialog', 'positive')} />
            <label htmlFor="positive" className="text-sm font-medium leading-none">
              Положительное впечатление
            </label>
          </div>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit}>
        <Card>
            <div className="flex flex-col space-y-1.5">
                <CardTitle className="flex justify-between m-2">
                  <span>2. Сбор анкеты</span> <Badge className='text-green-800'>90%</Badge>
                </CardTitle>
                <CardContent className="flex flex-col gap-2 items-start justify-around">
                
                <div className="flex items-center space-x-2">
            <Checkbox
              id="name"
              checked={formData.firstDialog.name}
              onChange={() => handleCheckboxChange('firstDialog', 'name')} />
            <label htmlFor="name" className="text-sm font-medium leading-none">
             Имя
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="phone"
              checked={formData.firstDialog.phone}
              onChange={() => handleCheckboxChange('firstDialog', 'phone')} />
            <label htmlFor="phone" className="text-sm font-medium leading-none">
             Телефон
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="age"
              checked={formData.firstDialog.age}
              onChange={() => handleCheckboxChange('firstDialog', 'age')} />
            <label htmlFor="age" className="text-sm font-medium leading-none">
              Возраст
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="citizenship"
              checked={formData.firstDialog.citizenship}
              onChange={() => handleCheckboxChange('firstDialog', 'citizenship')} />
            <label htmlFor="citizenship" className="text-sm font-medium leading-none">
              Местоположение
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="professions"
              checked={formData.firstDialog.professions}
              onChange={() => handleCheckboxChange('firstDialog', 'professions')} />
            <label htmlFor="professions" className="text-sm font-medium leading-none">
              Профессии
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="documents"
              checked={formData.firstDialog.documents}
              onChange={() => handleCheckboxChange('firstDialog', 'documents')} />
            <label htmlFor="documents" className="text-sm font-medium leading-none">
             Документы на словах
            </label>
          </div>
                  {/* Повторите для других чекбоксов */}
                </CardContent>
            </div>
        </Card>

        <Button type="submit" variant="outline" className="mt-4">
          Отправить
        </Button>
      </form>
    </>
  );
};
