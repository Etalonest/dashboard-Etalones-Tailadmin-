'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfessionSelect, ExpirienceSelect } from '@/src/components/Select/Select';
import { useState } from 'react';
import AutocompleteInput from '../../AutocompleteInput/AutocompleteInput';
import { suggestionsData } from '@/src/config/suggestions';
import CMultiSelect from '../../Multiselect/Multiselect';
import { drivePermis, langues } from '@/src/config/constants';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { X } from 'lucide-react';

type ProfessionElement = {
  id: number;
};
const AddpartnerForm = () => {
  const [professions, setProfessions] = useState<ProfessionElement[]>([]);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    expirience: '',
    contractType: '',
    contractPrice: '',
    sallary: '',
    homePrice: '',
    avance: '',
    workwear: '',
  });
  const handleInputChange = (inputKey: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [inputKey]: value,
    }));
  };
  const handleButtonClick = () => {
    const newProfession: ProfessionElement = {
      id: professions.length + 1, 
    };
    
    setProfessions((prevProfessions) => [...prevProfessions, newProfession]);
  };
  const handleRemoveProfession = (id: number) => {
    // Удаляем элемент по id
    setProfessions((prevProfessions) =>
      prevProfessions.filter((profession) => profession.id !== id)
    );
  };
  return (
    <><div className='container mx-auto'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className=" p-4">
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className='mt-0 flex flex-col gap-2'>
              <div>
              <Label>ФИО</Label>
              <Input placeholder="Имя" />
              </div><div>
              <Label>Телефон</Label>
              <Input placeholder="+495651322654" />
              </div><div>
              <Label>Viber</Label>
              <Input placeholder="+495651322654" />
              </div><div>
              <Label>Whatsapp</Label>
              <Input placeholder="+495651322654" />
              </div><div>
              <Label>Telegram</Label>
              <Input placeholder="+495651322654" />
              </div><div>
              <Label>Почта</Label>
              <Input placeholder="mail@gmail.com" />
              </div>
              <Button variant="outline" className='bg-green-900 text-white mt-8'>Добавить информацию</Button>

            </CardContent>

          </Card>
        </div>
        <div className=" p-4">
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle>Фирма</CardTitle>
            </CardHeader>
            <CardContent className='mt-0 flex flex-col gap-2'>
            <div>
              <Label>Название фирмы</Label>
              <Input placeholder="GMBH gfgtg" />
              </div><div>
              <Label>Номер DE</Label>
              <Input placeholder="DE495651322654" />
              </div><div>
              <Label>Местоположение</Label>
              <Input placeholder="Дюсельдорф" />
              </div><div>
              <Label>Сайт</Label>
              <Input placeholder="www.site.com" />
              </div>

              <AutocompleteInput 
              label="Тип контракта"
              suggestions={suggestionsData.contractType} 
              placeholder="Введите тип контракта"
              onChange={(value) => handleInputChange('contractType', value)}/>
              <AutocompleteInput 
              label="Цена контракта"
              suggestions={suggestionsData.contractPrice} 
              placeholder="Введите цену контракта"
              onChange={(value) => handleInputChange('contractPrice', value)}/>
              <Button variant="outline" className='bg-green-900 text-white mt-8' onClick={handleButtonClick}>Добавить профессию</Button>
            </CardContent>
          </Card>
        </div><div className=" p-4">
          <Card>
            <CardHeader>
              <CardTitle>Статус</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
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
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div><div className="mt-8 w-full bg-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {professions.map((profession, index) => (
          
          <div key={profession.id} className=" p-4 mb-4 ">
            <Card>
              <CardHeader>
                <CardTitle className='flex justify-start items-center gap-1 relative'>
                  {index + 1}.
                  <ProfessionSelect />
                  <Button
                  variant="outline"
                  className="bg-red-600 text-white absolute right-0 top-0 p-2"
                  onClick={() => handleRemoveProfession(profession.id)} 
                >
                  <X size={15} />
                </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-2'>
              <AutocompleteInput 
              label="Навыки"
              suggestions={suggestionsData.skils} 
              placeholder="Укажите набор навыков"
              onChange={(value) => handleInputChange('skils', value)}/>
              <div>
              <Label>Опыт работы</Label>
              <ExpirienceSelect />
              </div>
               <div>
                <Label>Свободные места</Label>
                <Input type='number' placeholder="Введите количество свободных мест"/>
                </div> 
                <AutocompleteInput 
              label="Зарплата"
              suggestions={suggestionsData.sallary} 
              placeholder="Зарплата работника"
              onChange={(value) => handleInputChange('sallary', value)}/>
                <AutocompleteInput 
              label="Цена проживания"
              suggestions={suggestionsData.homePrice} 
              placeholder="Стоимость проживания"
              onChange={(value) => handleInputChange('homePrice', value)}/>
              <AutocompleteInput 
              label="Авансы"
              suggestions={suggestionsData.avance} 
              placeholder="Отношение к авансу"
              onChange={(value) => handleInputChange('avance', value)}/>
              <AutocompleteInput 
              label="Спецодежда"
              suggestions={suggestionsData.workwear} 
              placeholder="Спецодежда"
              onChange={(value) => handleInputChange('workwear', value)}/>
               <div>
                <Label>Наличие В/У</Label>
                <CMultiSelect options={drivePermis} placeholder={'Выбериите категории'} onChange={function (selected: string[]): void {
                  throw new Error('Function not implemented.');
                } } />
                </div>
                <div>
                <Label>Знание языков</Label>
                <CMultiSelect options={langues} placeholder={'Выберите языки'} onChange={function (selected: string[]): void {
                  throw new Error('Function not implemented.');
                } }/>
                </div>
                <AutocompleteInput 
              label="Часы отработки"
              suggestions={suggestionsData.wHours} 
              placeholder="Количество часов отработки"
              onChange={(value) => handleInputChange('wHours', value)}/>
                <div>
                <Label>Набор открыт с:</Label>
                <Input type='date' placeholder="Введите дату открытия"/>
                </div>
                  <Drawer >
      <DrawerTrigger asChild>
        <Button variant="outline" className="bg-green-900 text-white">Добавить вакансию</Button>
      </DrawerTrigger>
      <DrawerContent >
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <DrawerContent className='flex w-full'>
           
              <div>
          <ProfessionSelect />
              <AutocompleteInput 
              label="Навыки"
              suggestions={suggestionsData.skils} 
              placeholder="Укажите набор навыков"
              onChange={(value) => handleInputChange('skils', value)}/>
              <div>
              <Label>Опыт работы</Label>
              <ExpirienceSelect />
              </div>
               <div>
                <Label>Свободные места</Label>
                <Input type='number' placeholder="Введите количество свободных мест"/>
                </div> 
                <AutocompleteInput 
              label="Зарплата"
              suggestions={suggestionsData.sallary} 
              placeholder="Зарплата работника"
              onChange={(value) => handleInputChange('sallary', value)}/>
                <AutocompleteInput 
              label="Цена проживания"
              suggestions={suggestionsData.homePrice} 
              placeholder="Стоимость проживания"
              onChange={(value) => handleInputChange('homePrice', value)}/>
              <AutocompleteInput 
              label="Авансы"
              suggestions={suggestionsData.avance} 
              placeholder="Отношение к авансу"
              onChange={(value) => handleInputChange('avance', value)}/>
              <AutocompleteInput 
              label="Спецодежда"
              suggestions={suggestionsData.workwear} 
              placeholder="Спецодежда"
              onChange={(value) => handleInputChange('workwear', value)}/>
               <div>
                <Label>Наличие В/У</Label>
                <CMultiSelect options={drivePermis} placeholder={'Выбериите категории'} onChange={function (selected: string[]): void {
                  throw new Error('Function not implemented.');
                } } />
                </div>
                <div>
                <Label>Знание языков</Label>
                <CMultiSelect options={langues} placeholder={'Выберите языки'} onChange={function (selected: string[]): void {
                  throw new Error('Function not implemented.');
                } }/>
                </div>
                <AutocompleteInput 
              label="Часы отработки"
              suggestions={suggestionsData.wHours} 
              placeholder="Количество часов отработки"
              onChange={(value) => handleInputChange('wHours', value)}/>
                <div>
                <Label>Набор открыт с:</Label>
                <Input type='date' placeholder="Введите дату открытия"/>
                </div>
              </div>
          </DrawerContent>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
              </CardContent>
            </Card>
            

          </div>
        ))}
      </div></>
  );
};

export default AddpartnerForm;

