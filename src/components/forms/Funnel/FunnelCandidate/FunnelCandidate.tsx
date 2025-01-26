'use client'
import { useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export const FunnelCandidate = ({ onFormDataChange, initialData }: any) => {
  const [formData, setFormData] = useState(initialData || {
    firstDialog: {
      viber: false,
      whatsapp: false,
      telegram: false,
      goodImpression: false,
      badImpression: false,
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

  const handleCheckboxChange = (section: string, field: string) => {
    setFormData((prevState: any) => {
      const newFormData = { ...prevState };
      newFormData[section][field] = !newFormData[section][field];

      // Если передан callback (onFormDataChange), передаем данные родителю
      if (onFormDataChange) {
        onFormDataChange(newFormData);
      }

      return newFormData;
    });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Например, можно сделать что-то с данными перед отправкой:
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
    
    // Здесь можно сделать дополнительные действия (например, отправить данные на сервер)
    console.log("Форма отправлена с данными:", formData);
  };

  return (
    <><Card>
          <CardTitle className="flex justify-start m-2">
              1. Первый диалог
          </CardTitle>
          <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-around">
                  <Button variant="outline" className="bg-red-800 hover:bg-red-500 text-white">
                      Не сложился
                  </Button>
                  <Button variant="outline" className="bg-green-800 hover:bg-green-500 text-white">
                      Сложился
                  </Button>
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
                  <CardContent>
                      <div className="flex flex-col space-y-1.5">

                          <Card>
                              <CardTitle className="flex justify-start m-2">
                                  2. В процесе договорённости
                              </CardTitle>
                              <CardContent className="flex flex-col gap-2 items-start justify-around">
                                  <div className="flex items-center space-x-2">
                                      <Checkbox
                                          id="noFearOfPaidHousing"
                                          checked={formData.negotiationProcess.noFearOfPaidHousing}
                                          onChange={() => handleCheckboxChange('negotiationProcess', 'noFearOfPaidHousing')} />
                                      <label
                                          htmlFor="noFearOfPaidHousing"
                                          className="text-sm font-medium leading-none"
                                      >
                                          Не пугает платное проживание
                                      </label>
                                  </div>
                                  {/* Повторите для других чекбоксов */}
                              </CardContent>
                          </Card>
                      </div>
                  </CardContent>
              </Card>
              <Button type="submit" variant="outline" className="mt-4">
                  Отправить
              </Button>
          </form></>
  );
};
