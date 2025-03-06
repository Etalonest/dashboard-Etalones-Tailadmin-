'use client'
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
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
import { drivePermisData, languesData, statusDataPartner, taskStats } from '@/src/config/constants';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CommentEntry, DocumentEntry } from '../interfaces/FormCandidate.interface';
import { ProfessionPartner } from '@/src/types/professionParnter';
import { Contract } from '@/src/components/forms/interfaces/FormCandidate.interface';
import { Textarea } from '@/components/ui/textarea';
import { DocumentChoise } from './DocumentChoise/DocumentChoise';
import { WorkUpChoise } from './WorkUpChoise/WorkUpChoise';
import Select  from '@/src/components/inputs/Select/Select';


const AddpartnerForm = ({onSubmitSuccess}: any) => {
  const { data: session } = useSession();
  const managerId = session?.managerId || '';
  const authorName = session?.user?.name || '';
  const { addNotification } = useNotifications();
  const [phone, setPhone] = useState<string>('');
  const [numberDE, setNumberDE] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [professions, setProfessions] = useState<ProfessionPartner[]>([]);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>([]);
  const [workStatuses, setWorkStatuses] = useState<{ name: string; date: Date }[]>([]);
  const [contract, setContract] = useState<Contract>({
    typeC: '',
    sum: '',
    salaryWorker: '',
  });
  const [comment, setComment] = useState<CommentEntry>({
      authorId: '',
      author: '',
      text: '',
      date: new Date(),
    });
  const handleUniqueFieldCheck = async (field: string, value: string) => {
    if (value.trim() === '') return;  // Пропуск пустого значения

    try {
      const response = await fetch(`/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }), // Отправляем поле и его значение в теле запроса
      });

      const data = await response.json();

      if (data.error) {
        addNotification({
          title: "Ошибка",
          content: `Партнёр с таким ${field} уже существует.`,
          metadata: data.metadata,
          type: "error",
          id: uuidv4Original(),
        });
      } else {
        addNotification({
          title: `${field} свободен`,
          content: `Этот ${field} ещё не зарегистрирован.`,
          type: 'success',
          id: uuidv4Original(),
        });
      }
    } catch (error) {
      console.error('Ошибка при проверке уникальности:', error);
    }
  };

  // Обработчики для каждого поля
  const handlePhoneBlur = () => handleUniqueFieldCheck('phone', phone);
  const handleNumberDEBlur = () => handleUniqueFieldCheck('numberDE', numberDE);
  const handleEmailBlur = () => handleUniqueFieldCheck('email', email);



  const handleInputChange = (field: string, value: string) => {
    setContract((prevContract) => ({
      ...prevContract,
      [field]: value,
    }));
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      setComment((prevComment) => ({
        ...prevComment,
        text: value,
      }));
    };
    const getSWforSubmit = () => {
      return workStatuses.map(status => ({
        name: status.name,
        date: status.date
      }));
    };
    const getDocumentsDataForSubmit = () => {
      return documentEntries.map(doc => ({
        docType: doc.docType || '',
        dateExp: doc.dateExp || '',
        dateOfIssue: doc.dateOfIssue || '',
        numberDoc: doc.numberDoc || '',
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
      pDocs: [],
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
    setProfessions(prevProfessions => {
      return prevProfessions.map(prof => {
        if (prof.id === id) {
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
    )};

  const getProfessionsDataForSubmit = () => {
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
  const handleDocumentChange = (selectedDocuments: any[]) => {
    const updatedDocuments = selectedDocuments.map(docType => ({
      docType: docType,
      dateExp: '',
      dateOfIssue: '',
      numberDoc: '',
      file: undefined,
    }));

    setDocumentEntries(updatedDocuments);
  };

  const handleStatusesChange = (selectWS: string[]) => {
    const updatedWS = selectWS.map(name => ({
      name: name,
      date: new Date()
    }));

    setWorkStatuses(updatedWS);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const professionsData = getProfessionsDataForSubmit();
    const documentsData = getDocumentsDataForSubmit();
    const workStatusesData = getSWforSubmit();

    const contractData = {
      typeC: contract.typeC,
      sum: contract.sum,
    };
    const commentData = {
      authorId: managerId,
      author: authorName,
      text: comment.text,
      date: comment.date.toISOString(),
    };
    const formData = new FormData(event.target);
  
    // Добавляем только те поля, которые отсутствуют в оригинальном formData
    formData.append('managerId', managerId);
    formData.append('professions', JSON.stringify(professionsData));
    if (commentData.text) {
      formData.append('comment', JSON.stringify([commentData]));
    }    
    formData.append('contract', JSON.stringify(contractData));
    formData.append('documents', JSON.stringify(documentsData));
    formData.append('statusWork', JSON.stringify(workStatusesData));

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
          metadata: data.metadata,
          type: 'success',
          id: uuidv4Original(),
        });
        onSubmitSuccess()
      }
  
      if (data.error) {
        addNotification({
          title: 'Ошибка',
          content: message,
          metadata: data.metadata,
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
              <CardTitle className='flex justify-between'>
              <p>Личные данные</p> 
              <div>
                <Label>
                Статус
                </Label>
                <Select
                    id='status'
                    name="status"
                    placeholder="Статус выполнения"
                    options={statusDataPartner}
                    />
              </div>
              </CardTitle>
            </CardHeader>
             <CardHeader className='grid grid-cols-3 gap-2'>
                                <CardTitle className="col-span-1">Документ</CardTitle>
                                <div className="col-span-2">
                                  <DocumentChoise onDocumentsChange={handleDocumentChange} />
                                  <div className='w-full h-[2px] bg-gray-300 my-2 mr-5 rounded-md'></div>
                                </div>
            
                                <CardTitle className="col-span-1">Готовность к работе</CardTitle>
                                <div className="col-span-2">
                                  <WorkUpChoise onStatusesChange={handleStatusesChange} />
                                </div>
                              </CardHeader>
            <CardContent className='mt-0 grid grid-cols-2 gap-2'>
              <div>
              <Label>ФИО</Label>
              <Input placeholder="Имя" name='name'/>
              </div><div>
              <Label>Телефон</Label>
              <Input placeholder="+495651322654" name='phone'
              onBlur={handlePhoneBlur}
              onChange={(e) => setPhone(e.target.value)}
              />
              </div><div>
              <Label>Viber</Label>
              <Input placeholder="+495651322654" name='viber'/>
              </div><div>
              <Label>Whatsapp</Label>
              <Input placeholder="+495651322654" name='whatsapp'/>
              </div><div>
              <Label>Telegram</Label>
              <Input placeholder="+495651322654" name='telegram'/>
              </div><div>
              <Label>Почта</Label>
              <Input placeholder="mail@gmail.com" name='email'
              onBlur={handleEmailBlur}
              onChange={(e) => setEmail(e.target.value)}
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
              <Input placeholder="GMBH gfgtg" name='companyName'/>
              </div><div>
              <Label>Номер DE</Label>
              <Input placeholder="DE495651322654" name='numberDE'
              onBlur={handleNumberDEBlur}
              onChange={(e) => setNumberDE(e.target.value)}
              />
              </div><div>
              <Label>Местоположение</Label>
              <Input placeholder="Дюсельдорф" name='location'/>
              </div><div>
              <Label>Сайт</Label>
              <Input placeholder="www.site.com" name='site'/>
              </div>
              <div className='col-span-2 grid grid-cols-3 gap-4'>
            <AutocompleteInput 
              name='contractType'
              label="Тип контракта"
              suggestions={suggestionsData.contractType} 
              placeholder="Введите тип контракта"
              onChange={(value) => handleInputChange('typeC', value)}/>
              <AutocompleteInput 
              name='contractPrice'
              label="Цена контракта"
              suggestions={suggestionsData.contractPrice} 
              placeholder="Введите цену контракта"
              onChange={(value) => handleInputChange('sum', value)}/>
               <AutocompleteInput 
              name='salaryWorker'
              label="Минимальная зарплата работника"
              suggestions={suggestionsData.contractPrice} 
              placeholder="Минимальная зарплата работника"
              onChange={(value) => handleInputChange('salaryWorker', value)}/>
            </div>
            </CardContent>
            <div className="flex-1  p-4">
                     <Card>
                       <CardContent>
                         <CardTitle>Комментарий</CardTitle>
                         <Textarea
                           placeholder="Оставьте свой комментарий"
                           className="mt-5"
                           value={comment.text}
                           onChange={handleCommentChange} />
                       </CardContent>
                     </Card>
                           </div>
            <Button variant="outline" className='bg-green-900 text-white w-full' 
              onClick={handleButtonClick} type='button'> 
                Добавить профессию</Button>
          </Card>
        </div>
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
              suggestions={suggestionsData.salary} 
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
                <CMultiSelect options={drivePermisData} placeholder={'Выбериите категории'} 
                onChange={(selectedDriveP: string[]) => handleDrivePChange(selectedDriveP, profession.id)} />
                </div>
                <div>
                <Label>Знание языков</Label>
                <CMultiSelect options={languesData} placeholder={'Выберите языки'} 
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

export default AddpartnerForm;

