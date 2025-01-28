'use client'
import React, { useState } from 'react';
import { CirclePlus, X } from 'lucide-react';
import Select from '../../inputs/Select/Select';
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import { useSession } from 'next-auth/react';
import { drivePermisData, citizenshipOptions, languesData, langueLevelData } from '@/src/config/constants'
import { DocumentEntry, CommentEntry, Profession, Langue } from "../interfaces/FormCandidate.interface"
import { useProfessionContext } from "@/src/context/ProfessionContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import useCandidateData from '@/src/hooks/useCandidateData';
import { Candidate } from '@/src/types/candidate';
import { DocumentChoise } from './DocumentChoise/DocumentChoise';
import { WorkUpChoise } from './WorkUpChoise/WorkUpChoise';
import CMultiSelect from '../../Multiselect/Multiselect';
import { Textarea } from '@/components/ui/textarea';
import { FunnelCandidate } from '../Funnel/FunnelCandidate/FunnelCandidate';


const AddCandidateForm = () => {
  const { data: session } = useSession();
  const { professions } = useProfessionContext();
  const { addNotification } = useNotifications();
  const [candidateData, setCandidateData] = useState<any>(null);
  const [workStatuses, setWorkStatuses] = useState<{ name: string; date: Date }[]>([]);
  const [phone, setPhone] = useState<string>('');
  const [comment, setComment] = useState<CommentEntry>({
    authorId: '',
    author: '',
    text: '',
    date: new Date(),
  });
  const [languesEntries, setLanguesEntries] = useState<Langue[]>([{
    name: '',
    level: ''
  }]);
  const [selectedDrive, setSelectedDrive] = useState<string[]>([]);
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>([]);
  const [professionEntries, setProfessionEntries] = useState<Profession[]>([{
    name: '',
    expirience: '',
    category: ''
  }]);

  const managerId = session?.managerId || '';

  const authorName = session?.user?.name || '';
 
  const handleCandidateData = (data: any) => {
    setCandidateData(data);  
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handleDriveChange = (selected: string[]) => {
    setSelectedDrive(selected);
  };
  const getDriveDataForSubmit = () => {
    return selectedDrive;
  };



  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setComment((prevComment) => ({
      ...prevComment,
      text: value,
    }));
  };


  const addLangue = () => {
    setLanguesEntries([...languesEntries, { name: '', level: '' }]);
  };
  const handleLangueChange = (index: number, field: string, value: string) => {
    const updatedLangues = [...languesEntries];
    updatedLangues[index] = { ...updatedLangues[index], [field]: value };
    setLanguesEntries(updatedLangues);
  };

  const removeLangue = (index: number) => {
    const updatedLangues = languesEntries.filter((_, i) => i !== index);
    setLanguesEntries(updatedLangues);
  };


  const getLanguesDataForSubmit = () => {
    return languesEntries.map(lang => ({
      name: lang.name || '',
      level: lang.level || ''
    }));
  };

  const addDocumentEntry = () => {
    setDocumentEntries([
      ...documentEntries,
      { docType: 'Нет документов', dateExp: '', dateOfIssue: '', numberDoc: '', file: null }
    ]);
  };


  const handleStatusesChange = (selectWS: string[]) => {
    const updatedWS = selectWS.map(name => ({
      name: name,
      date: new Date()
    }));

    setWorkStatuses(updatedWS);
  };
  const handleDocumentChange = (selectedDocuments: string[]) => {
    const updatedDocuments = selectedDocuments.map(docType => ({
      docType: docType,
      dateExp: '',
      dateOfIssue: '',
      numberDoc: '',
      file: null,
    }));

    setDocumentEntries(updatedDocuments);
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



  const addProfessionEntry = () => {
    setProfessionEntries([...professionEntries, { name: 'Нет профессии', expirience: '', category: '' }]);
  };

  const handleProfessionChange = (index: number, field: string, value: string) => {
    const updatedProfessions = [...professionEntries];
    updatedProfessions[index] = { ...updatedProfessions[index], [field]: value };
    setProfessionEntries(updatedProfessions);
  };
  const getProfessionsDataForSubmit = () => {
    return professionEntries.map(prof => ({
      name: prof.name || '',
      expirience: prof.expirience || ''
    }));
  };



  const removeProfessionEntry = (index: number) => {
    const newEntries = professionEntries.filter((_, i) => i !== index);
    setProfessionEntries(newEntries);
  };


  const addAdditionalPhone = () => {
    setAdditionalPhones([...additionalPhones, '']);
  };

  const handleAdditionalPhoneChange = (index: number, value: string) => {
    const updatedPhones = [...additionalPhones];
    updatedPhones[index] = value;
    setAdditionalPhones(updatedPhones);
  };

  const removeAdditionalPhone = (index: number) => {
    const updatedPhones = additionalPhones.filter((_, i) => i !== index);
    setAdditionalPhones(updatedPhones);
  };

  const getAdditionalPhonesDataForSubmit = () => {
    return additionalPhones.filter(phone => phone.trim() !== '');
  };


  const handlePhoneBlur = async () => {
    if (phone.trim() === '') {
      return;
    }

    try {
      const response = await fetch('/api/checkPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.candidate) {
        addNotification({
          title: "Обновлено",
          content: `Кандидат с таким номером уже существует. Имя: ${data.candidate.name} Номер: ${data.candidate.phone}`,
          type: "error",
          id: uuidv4Original(),
        });
      } else if (data.message === 'Номер свободен') {
        addNotification({
          title: 'Номер свободен',
          content: 'Этот номер еще не зарегистрирован.',
          type: 'success',
          id: uuidv4Original(),
        });
      } else {
        addNotification({
          title: 'Ошибка',
          content: 'Произошла неизвестная ошибка.',
          type: 'error',
          id: uuidv4Original(),
        });
      }
    } catch (error) {
      console.error('Ошибка при поиске:', error);
    }
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const additionalPhonesData = getAdditionalPhonesDataForSubmit();
    const driveData = getDriveDataForSubmit();
    const professionsData = getProfessionsDataForSubmit();
    const documentsData = getDocumentsDataForSubmit();
    const languesData = getLanguesDataForSubmit();
    const workStatusesData = getSWforSubmit();
    const commentData = {
      authorId: managerId,
      author: authorName,
      text: comment.text,
      date: comment.date.toISOString(),
    };
    const formData = new FormData(event.target);

    // Добавляем только те поля, которые отсутствуют в оригинальном formData
    formData.append('managerId', managerId);
    formData.append('drivePermis', JSON.stringify(driveData));
    formData.append('professions', JSON.stringify(professionsData));
    formData.append('documents', JSON.stringify(documentsData));
    formData.append('langue', JSON.stringify(languesData));
    formData.append('additionalPhones', JSON.stringify(additionalPhonesData));
    formData.append('statusWork', JSON.stringify(workStatusesData));
    formData.append('comment', JSON.stringify(commentData));


    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        body: formData, // Используем formData, так как это содержит как текст, так и файлы
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
    <div >
      <h2 className="text-center text-black text-2xl font-semibold mb-2">Добавить нового кандидата</h2>
        <div className='container mx-auto flex'>
      <form onSubmit={handleSubmit} className='flex-1'>
              <div className="flex-1  p-4">
                <Card>
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
                      <Input placeholder="Имя" name='name' id='name'
                      />
                    </div>
                    <div>
                      <Label>Возраст</Label>
                      <Input placeholder="33" name='ageNum'

                      />
                    </div><div className='relative'>
                      <Label>Телефон</Label>
                      <Input placeholder="+495651322654" name='phone'
                        id='phone'
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}

                      />            <button type="button" className="absolute top-8 right-1 text-green-800 hover:text-green-500 transition duration-300 ease-in-out"
                        onClick={addAdditionalPhone}><CirclePlus width={20} height={20} /></button>

                      {additionalPhones.map((phone, index) => (
                        <div key={index} className="flex gap-2 justify-center items-center mt-1 relative">
                          <Label>{index + 2}.</Label>
                          <Input placeholder="+495651322654"
                            id={`additionalPhone${index}`}
                            name={`additionalPhone${index}`}
                            type="phone"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAdditionalPhoneChange(index, e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute top-1.5 right-1 btn-xs self-end pb-0.5 text-red-800 hover:text-red-500 transition duration-300 ease-in-out"
                            onClick={() => removeAdditionalPhone(index)}
                          >
                            <X />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div >
                      <div className='relative'>
                        <Label >Профессии</Label>
                        <button
                          className="absolute top-0 right-0 btn-xs text-green-800 hover:text-green-500 transition duration-300 ease-in-out"
                          type="button"
                          onClick={addProfessionEntry}
                        >
                          <CirclePlus size={20} />
                        </button>
                      </div>
                      {professionEntries.map((prof, index) => (
                        <div key={index} className='grid grid-cols-2 mt-1 gap-4 w-full relative'>
                          <label htmlFor="profession">
                            <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                              value={prof.name || ''} onChange={e => handleProfessionChange(index, 'name', e.target.value || '')}>
                              <option>Нет профессии</option>
                              {professions.map((profession: any) => (
                                <option key={profession._id} value={profession.name}>{profession.name}</option>
                              ))}
                            </select>
                          </label>
                          <label htmlFor="expirience">
                            <select className="flex h-9 w-[85%] rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                              value={prof.expirience || ''} onChange={e => handleProfessionChange(index, 'expirience', e.target.value || '')}>
                              <option value={'Без опыта'}>Без опыта</option>
                              <option value={'Меньше года'}>Меньше года</option>
                              <option value={'Более года'}>Более года</option>
                              <option value={'От 2-х лет'}>От 2-х лет</option>
                              <option value={'Более 10-ти лет'}>Более 10-ти лет</option>
                            </select>
                          </label>
                          <button
                            className="absolute right-0 top-1.5 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                            type="button" onClick={() => removeProfessionEntry(index)}><X /></button>
                        </div>
                      ))}
                    </div>
                    <Select label={'Гражданство'} id="citizenship" name="citizenship" placeholder='Выберите гражданство' options={citizenshipOptions} />
                    <div>
                      <Label>Местоположение</Label>
                      <Input placeholder="Минск, Беларусь" name='locations' id='locations'
                      />
                    </div><div>
                      <Label>Водительское удостоверение</Label>
                      <CMultiSelect options={drivePermisData}
                        placeholder={'Выбериите категории'}
                        onChange={handleDriveChange} />
                    </div>



                    <div >
                      <div className='relative'>
                        <button className="absolute top-0 right-0 btn-xs text-green-800 hover:text-green-500 transition duration-300 ease-in-out"
                          type="button" onClick={addLangue}>
                          <CirclePlus size={20} />
                        </button>
                      </div>
                      <div>
                        <div className='relative'>
                          <Label >Языки</Label>
                          <button
                            className="absolute top-0 right-0 btn-xs text-green-800 hover:text-green-500 transition duration-300 ease-in-out"
                            type="button"
                            onClick={addLangue}
                          >
                            <CirclePlus size={20} />
                          </button>
                        </div>
                        {languesEntries.map((lang, index) => (
                          <div key={index} className='relative grid grid-cols-2 gap-2'>
                            <Select id={''} options={languesData}
                              placeholder='Выберите язык'
                              value={lang.name}
                              onChange={(e: any) => handleLangueChange(index, 'name', e.target.value)}
                              name={`langue-${index}`} />
                            <div className='w-[85%]'>
                              <Select id={''} options={langueLevelData}
                                placeholder='Выберите уровень'
                                value={lang.level}
                                onChange={(e: any) => handleLangueChange(index, 'level', e.target.value)}
                              />

                            </div>
                            <button
                              className="absolute z-25 right-0 top-1.5 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                              type="button"
                              onClick={() => removeLangue(index)}
                            >
                              <X />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* <Button variant="outline" className='bg-green-900 text-white mt-8'>Добавить информацию</Button> */}

                  </CardContent>

                </Card>
              </div> 
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
        {/* Кнопка отправки формы */}
        <div className="col-span-full mt-6 text-center">
          <Button type="submit" className="fixed top-4 right-5 bg-green-900 text-white hover:bg-green-700">
            Добавить
          </Button>
        </div>
            </form>
            <div className="flex-2  p-4">
            <FunnelCandidate onDataChange={handleCandidateData} author={managerId}/>
         <FunnelCandidate onDataChange={handleCandidateData}/>
        </div>
        </div>
               
    </div>
  );
};

export default AddCandidateForm;

