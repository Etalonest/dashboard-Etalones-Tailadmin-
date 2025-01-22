'use client'
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfessionSelect, ExpirienceSelect } from '@/src/components/Select/Select';
import { use, useEffect, useState } from 'react';
import AutocompleteInput from '../../AutocompleteInput/AutocompleteInput';
import { suggestionsData } from '@/src/config/suggestions';
import CMultiSelect from '../../Multiselect/Multiselect';
import { drivePermis, langues } from '@/src/config/constants';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CommentEntry } from '../interfaces/FormCandidate.interface';
import { ProfessionPartner } from '@/src/types/professionParnter';
import usePartnerData from '@/src/utils/usePartnerData';
import { p } from 'framer-motion/client';

const EditpartnerForm = ({partner}: any) => {
    const { data: session } = useSession();
    const managerId = session?.managerId || '';
  const { addNotification } = useNotifications();
  const {
    selectName,
    selectPhone,
    selectViber,
    selectTelegram,
    selectWhatsapp,
    selectEmail,
    selectCompanyName,
    selectNumberDE,
    selectLocation,
    selectSite,
    contractType,
    contractPrice,
    handleChangeName,
    handleChangePhone,
    handleChangeViber,
    handleChangeTelegram,
    handleChangeWhatsapp,
    handleChangeEmail,
    handleChangeCompanyName,
    handleChangeNumberDE,
    handleChangeLocation,
    handleChangeSite,
    handleChangeContractType,
    handleChangeContractPrice
  } = usePartnerData(partner);

  
  
  const [professions, setProfessions] = useState<ProfessionPartner[]>(
    partner?.professions || []  
  );  
  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    contractType: partner?.contract?.typeC || '',
    contractPrice: partner?.contract?.sum || '',
  });
  const handleInputChange = (inputKey: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [inputKey]: value,
    }));
  };
  const handleButtonClick = () => {
    const newProfession: ProfessionPartner = {
      id: professions.length + 1,
      name: '',
      location: '',
      skills: '',
      experience: '',
      place: 0,
      salary: '',
      rentPrice: '',
      avans: '',
      workwear: '',
      drivePermis: [],
      langue: [],
      workHours: '',
      getStart: new Date(),
      candidates: [],
      interview: []
    };

    setProfessions((prevProfessions) => [...prevProfessions, newProfession]);
  };
  const handleProfessionSelect = (selectedName: string, id: number) => {
    console.log("Обновление профессии", { selectedName, id });
    setProfessions((prevProfessions) =>
      prevProfessions.map((prof) =>
        prof.id === id ? { ...prof, name: selectedName } : prof
      )
    );
  };
  const handleExperienceSelect = (selectedExperience: string, id: number) => {
    setProfessions((prevProfessions) =>
      prevProfessions.map((prof) =>
        prof.id === id ? { ...prof, experience: selectedExperience } : prof
      )
    );
  };

  const handleInputPChange = (id: number, field: string, value: string) => {
    console.log("Обновление профессии", { id, field, value });
    setProfessions(prevProfessions => {
      return prevProfessions.map(prof => {
        if (prof.id === id) {
          // Убедитесь, что обновляется правильное поле (например, skills)
          return { ...prof, [field]: value };
        }
        return prof;
      });
    });
  };
  
  const handleDrivePChange = (selectedDriveP: string[],id: number) => {
    setProfessions((prevProfessions) =>
      prevProfessions.map((prof) =>
        prof.id === id ? { ...prof, drivePermis: selectedDriveP } : prof
      )
    );};

    const handleLangues = (selectedLangues: string[], id: number) => {
    setProfessions((prevProfessions) =>
      prevProfessions.map((prof) =>
        prof.id === id ? { ...prof, langue: selectedLangues } : prof
      )
    );};

  const getProfessionsDataForSubmit = () => {
    console.log("Профессии для отправки", professions);
    return professions.map((prof) => ({
      name: prof.name || '',
      location: prof.location || '',
      skills: prof.skills || '',
      experience: prof.experience || '',
      place: prof.place || 0,
      salary: prof.salary || '',
      rentPrice: prof.rentPrice || '',
      avans: prof.avans || '',
      workwear: prof.workwear || '',
      drivePermis: prof.drivePermis || [],
      langue: prof.langue || [],
      workHours: prof.workHours || '',
      getStart: prof.getStart || new Date,
      candidates: prof.candidates || [],
      interview: prof.interview || [],
    }));
  };
  

  const handleRemoveProfession = (id: number) => {
    // Удаляем элемент по id
    setProfessions((prevProfessions) =>
      prevProfessions.filter((profession) => profession.id !== id)
    );
  };



  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const professionsData = getProfessionsDataForSubmit();
 
    const formData = new FormData(event.target);
  
    // Добавляем только те поля, которые отсутствуют в оригинальном formData
    formData.append('managerId', managerId);
    formData.append('professions', JSON.stringify(professionsData));

  
    try {
      const response = await fetch('/api/partner', {
        method: 'POST',
        body: formData, 
      });
  
      const data = await response.json();
      const message = data.message;
  
      if (data.success) {
        addNotification({
          title: 'Успешно',
          content: message,
          type: 'success',
          id: uuidv4Original(),
        });
      }
  
      if (data.error) {
        addNotification({
          title: 'Ошибка',
          content: message,
          type: 'error',
          id: uuidv4Original(),
        });
      }
    } catch (error) {
      console.error('Ошибка при добавлении кандидата:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className='container mx-auto'>
      <div className="flex flex-wrap gap-4">
        <div className='w-full flex-1'>
        <div className="flex-1  p-4">
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className='mt-0 grid grid-cols-2 gap-2'>
              <div>
              <Label>ФИО</Label>
              <Input placeholder="Имя" name='name'
                value={selectName  || ''}
                onChange={handleChangeName}             />
              </div><div>
              <Label>Телефон</Label>
              <Input placeholder="+495651322654" name='phone'
              value={selectPhone || ''}
              onChange={handleChangePhone}
              />
              </div><div>
              <Label>Viber</Label>
              <Input placeholder="+495651322654" name='viber'
              value={selectViber || ''}
              onChange={handleChangeViber}
              />
              </div><div>
              <Label>Whatsapp</Label>
              <Input placeholder="+495651322654" name='whatsapp'
              value={selectWhatsapp || ''}
              onChange={handleChangeWhatsapp}
              />
              </div><div>
              <Label>Telegram</Label>
              <Input placeholder="+495651322654" name='telegram'
              value={selectTelegram || ''}
              onChange={handleChangeTelegram}
              />
              </div><div>
              <Label>Почта</Label>
              <Input placeholder="mail@gmail.com" name='email'
              value={selectEmail || ''}
              onChange={handleChangeEmail}
              />
              </div>
              {/* <Button variant="outline" className='bg-green-900 text-white mt-8'>Добавить информацию</Button> */}

            </CardContent>

          </Card>
        </div>
        <div className="flex-1  p-4">
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle>Фирма</CardTitle>
            </CardHeader>
            <CardContent className='mt-0 grid grid-cols-2 gap-2'>
            <div>
              <Label>Название фирмы</Label>
              <Input placeholder="GMBH gfgtg" name='companyName'
              value={selectCompanyName || ''}
              onChange={handleChangeCompanyName}
              />
              </div><div>
              <Label>Номер DE</Label>
              <Input placeholder="DE495651322654" name='numberDE'
              value={selectNumberDE || ''}
              onChange={handleChangeNumberDE}
              />
              </div><div>
              <Label>Местоположение</Label>
              <Input placeholder="Дюсельдорф" name='location'
              value={selectLocation || ''}
              onChange={handleChangeLocation}
              />
              </div><div>
              <Label>Сайт</Label>
              <Input placeholder="www.site.com" name='site'
              value={selectSite || ''}
              onChange={handleChangeSite}
              />
              </div>
            <AutocompleteInput 
              name='contractType'
              label="Тип контракта"
              suggestions={suggestionsData.contractType} 
              value={contractType}
              placeholder="Введите тип контракта"
              onChange={(value) => handleInputChange('contractType', value)}/>
              <AutocompleteInput 
              name='contractPrice'
              label="Цена контракта"
              suggestions={suggestionsData.contractPrice}
              value={contractPrice}
              placeholder="Введите цену контракта"
              onChange={(value) => handleInputChange('contractPrice', value)}/>
            </CardContent>
            <Button variant="outline" className='bg-green-900 text-white w-full' 
              onClick={handleButtonClick} type='button'> 
                Добавить профессию</Button>
          </Card>
        </div>
        </div>
        
        <div className="flex-2  p-4">
          <Card>
            <CardHeader>
              <CardTitle>Статус</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1.5">
                  <Card><CardTitle className='flex justify-start m-2'>1. Не обработан</CardTitle></Card>
                  <Card>
                    <CardTitle className='flex justify-start m-2'>2. Первый диалог</CardTitle>
                    <CardContent className='flex items-center justify-around'>

                      <Button variant="outline" className='bg-red-500 text-white'>Не сложился</Button>
                      <Button variant="outline" className='bg-green-900 text-white'>Сложился</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardTitle className='flex justify-start m-2'>3. В процесе договорённости</CardTitle>
                    <CardContent className='flex flex-col gap-2 items-start justify-around'>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Цена контракта согласована
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Цена жилья согласована
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Даты выплат согласованы
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Контракт подписан
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Точное место для прибытия кандидата согласовано
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Готов принимать людей
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >  Передан куратору
                        </label>
                      </div>

                    </CardContent>
                  </Card>

                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <div className="mt-8 w-full bg-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {professions.map((profession, index) => (
          
          <div key={profession.id} className=" p-4 mb-4 ">
            <Card className='relative '>
            <Button
                  variant="outline"
                  className="bg-red-600 text-white absolute right-2 top-2 p-2"
                  onClick={() => handleRemoveProfession(profession.id)} 
                >
                  <X size={15} />
                </Button>
                  <span className='m-1 font-bold'>{index + 1}.</span>
                <CardTitle className='grid grid-cols-2 gap-1 relative pt-10 px-6'>
                  <ProfessionSelect
                  professionId={profession.id}
                  onProfessionChange={handleProfessionSelect}/>
                  <div>
              <Label>Местоположение</Label>
              <Input 
              value={profession.location}
              onChange={(e) => handleInputPChange(profession.id, 'location', e.target.value)}              />
              </div>

                </CardTitle>
              <CardContent className='flex flex-col gap-2'>
         <div className='grid grid-cols-2 gap-2 '>
         <AutocompleteInput 
              value={profession.skills}  
              label="Навыки"
              suggestions={suggestionsData.skils}
              placeholder="Укажите набор навыков"
              onChange={(value) => handleInputPChange(profession.id, 'skills', value)}/>          
              <div>
              <Label>Опыт работы</Label>
              <ExpirienceSelect 
              onProfessionChange={handleExperienceSelect}
              professionId={profession.id}
              />
              </div>
         </div>
              
               
                <div className='grid grid-cols-2 gap-2'>
                <AutocompleteInput 
              label="Зарплата"
              suggestions={suggestionsData.sallary} 
              placeholder="Зарплата работника"
              onChange={(value) => handleInputPChange(profession.id, 'salary', value)}/>
                <AutocompleteInput 
              label="Цена проживания"
              suggestions={suggestionsData.homePrice} 
              placeholder="Стоимость проживания"
              onChange={(value) => handleInputPChange(profession.id, 'rentPrice', value)}/>
                  </div> 
              <div className='grid grid-cols-2 gap-2'>
                
              <AutocompleteInput 
              label="Авансы"
              suggestions={suggestionsData.avance} 
              placeholder="Отношение к авансу"
              onChange={(value) => handleInputPChange(profession.id, 'avans', value)}/>
              <AutocompleteInput 
              label="Спецодежда"
              suggestions={suggestionsData.workwear} 
              placeholder="Спецодежда"
              onChange={(value) => handleInputPChange(profession.id, 'workwear', value)}/>
              </div>  
               <div className='grid grid-cols-2 gap-2'>
               <div>
                <Label>Наличие В/У</Label>
                <CMultiSelect options={drivePermis} placeholder={'Выбериите категории'} 
                onChange={(selectedDriveP: string[]) => handleDrivePChange(selectedDriveP, profession.id)} />
                </div>
                <div>
                <Label>Знание языков</Label>
                <CMultiSelect options={langues} placeholder={'Выберите языки'} 
                onChange={(selectedLangues: string[]) => handleLangues(selectedLangues, profession.id)} />
                
                </div>
               </div>
               <div className='grid grid-cols-2 gap-2'>

                <AutocompleteInput 
              label="Часы отработки"
              suggestions={suggestionsData.wHours} 
              placeholder="Количество часов отработки"
              onChange={(value) => handleInputPChange(profession.id, 'workHours', value)}/>
                <div>
                <Label>Свободные места</Label>
                <Input type='number' placeholder="Введите количество свободных мест"
                value={profession.place}
                onChange={(e) => handleInputPChange(profession.id, 'place', e.target.value)}
                />
                </div>
                </div>
                <div>
                <Label>Набор открыт с:</Label>
                <Input type='date' placeholder="Введите дату открытия"
                onChange={(e) => handleInputPChange(profession.id, 'getStart', e.target.value)}
                />
                </div>
              </CardContent>
            </Card>
            

          </div>
        ))}
      </div>
      <Button 
      className='fixed top-4 right-4 bg-green-900 text-white hover:bg-green-700' 
      type='submit'>Сохранить</Button>

      </form>
  );
};

export default EditpartnerForm;

