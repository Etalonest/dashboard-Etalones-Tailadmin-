'use client'
import React, {  useEffect, useState } from 'react';
import DefaultInput from '../../inputs/DefaultInput/DefaultInput';
import { CirclePlus, ImageDown, Save, X } from 'lucide-react';
import Select from '../../inputs/Select/Select';
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import DefaultInputH from '../../inputs/DefaultInputH/DefaultInputH';
import MyMultiSelect from '@/src/components/inputs/MyMultiselect/MyMultiselect';
import { useSession } from 'next-auth/react';
import { drivePermis, status, citizenshipOptions } from '@/src/config/constants'
import { DocumentEntry, Langue, CommentEntry } from "../interfaces/FormCandidate.interface"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Card} from "@/components/ui/card";
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge';
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { p } from 'framer-motion/client';
import DownloadButton from '../../DownloadButton/DownloadButton';

const EditCandidateForm = ({ candidate, professions }: any) => {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();
  
      
  const [isOpen, setIsOpen] = useState(false)
  const [fileId, setFileId] = useState<string>('');
  const [selectesName, setSelectName] = useState(candidate?.name);
  const [selectPhone, setSelectPhone] = useState(candidate?.phone || "");
  const [additionalPhones, setAdditionalPhones] = useState(candidate?.additionalPhones || []);
  const [selectAgeNum, setSelectAgeNum] = useState(candidate?.ageNum || "");
  const [selectStatus, setSelectStatus] = useState(candidate?.status);
  const [professionEntries, setProfessionEntries] = useState(candidate?.professions || []);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>(candidate?.documents || []);
  const [commentEntries, setCommentEntries] = useState<CommentEntry[]>(candidate?.comment || []);
  const [selectCitizenship, setSelectCititzenship] = useState(candidate?.citizenship || '')
  const [leavingDate, setLeavingDate] = useState<string>(candidate?.leavingDate || "");
  const [selectLocations, setSelectLocations] = useState(candidate?.locations || '')
  const [selectDrive, setSelectDrive] = useState(candidate?.drivePermis || []);
  const [selectCardNumber, setSelectCardNumber] = useState(candidate?.cardNumber || '')
  const [selectLangues, setSelectLangues] = useState<Langue[]>(candidate?.langue || []);

  const managerId = session?.managerId ?? 'defaultManagerId'; 
  useEffect(() => {
    if (candidate?.name) { setSelectName(candidate.name); }
  }, [candidate?.name]);
  useEffect(() => {
    if (candidate?.phone) { setSelectPhone(candidate.phone); }
  }, [candidate?.phone]);
  useEffect(() => {
    if (candidate?.additionalPhones) { setAdditionalPhones(candidate.additionalPhones); }
  }, [candidate?.additionalPhones]);
  useEffect(() => {
    if (candidate?.status) {
      setSelectStatus(candidate.status);
    }
  }, [candidate?.status]);
  useEffect(() => {
    if (candidate?.ageNum) { setSelectAgeNum(candidate.ageNum); }
  }, [candidate?.ageNum]);
  useEffect(() => {
    if (candidate?.documents) { setDocumentEntries(candidate.documents); }
  }, [candidate?.documents]);
  useEffect(() => {
    if (candidate?.professions) { setProfessionEntries(candidate.professions); }
  }, [candidate?.professions]);
  useEffect(() => {
    if (candidate?.comment) { setCommentEntries(candidate.comment); }
  }, [candidate?.comment]);
  useEffect(() => {
    if (candidate?.citizenship) { setSelectCititzenship(candidate.citizenship); }
  }, [candidate?.citizenship]);
  useEffect(() => {
    if (candidate?.leaving) {
      const formattedDate = new Date(candidate.leaving).toISOString().split("T")[0];
      setLeavingDate(formattedDate);
    }
  }, [candidate?.leaving]);
  useEffect(() => {
    if (candidate?.locations) {
      setSelectLocations(candidate.locations);
    }
  }, [candidate?.locations]);
  useEffect(() => {
    if (candidate?.drivePermis) { setSelectDrive(candidate.drivePermis); }
  }, [candidate?.drivePermis]);
  useEffect(() => {
    if (candidate?.cardNumber) {
      setSelectCardNumber(candidate.cardNumber);
    }
  }, [candidate?.cardNumber]);
  useEffect(() => {
    if (candidate?.langue) {
      setSelectLangues(candidate.langue);
    }
  }, [candidate?.langue]);
  const handleClick = (index: number) => {
    document.getElementById(`fileInput-${index}`)?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const updatedDocuments = [...documentEntries];
      updatedDocuments[index] = { ...updatedDocuments[index], file: selectedFile };
      setDocumentEntries(updatedDocuments);
    }
  };
  const handleSetFileId = (id: string) => {
    setFileId(id); 
  };


  
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectName(e.target.value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectPhone(e.target.value);
  };
  const handleChangeAgeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAgeNum(e.target.value);
  };
  const handleChange = (selectOption: { value: any; }) => {
    setSelectStatus(selectOption.value);
  };
  const handleAdditionalPhoneChange = (index: number, value: string) => {
    const phones = [...additionalPhones];
    phones[index] = value;
    setAdditionalPhones(phones);
  };
  const handleLangueChange = (index: number, field: keyof Langue, value: string) => {
    const updatedLangues = [...selectLangues];
    updatedLangues[index] = { ...updatedLangues[index], [field]: value };
    setSelectLangues(updatedLangues);
  };
  const handleDocumentChange = (index: number, field: string, value: string) => {
    const updatedDocuments = [...documentEntries];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setDocumentEntries(updatedDocuments);
  };
  const handleProfessionChange = (index: number, field: string, value: string) => {
    const newEntries = [...professionEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setProfessionEntries(newEntries);
  };
  const handleDriveChange = (selected: string[]) => {
    setSelectDrive(selected);
  };

  const addAdditionalPhone = () => {
    setAdditionalPhones([...additionalPhones, ""]);
  };
  const addLangue = () => {
    setSelectLangues([...selectLangues, { name: 'Не знает языков', level: '' }]);
  };

  const addDocumentEntry = () => {
    setDocumentEntries([...documentEntries, 
      { docType: 'Нет документов', dateExp: '', dateOfIssue: '', numberDoc: '', file: undefined }]);
  };

  const addProfessionEntry = () => {
    setProfessionEntries([...professionEntries, { name: 'Нет профессии', experience: '' }]);
  };




  const removeAdditionalPhone = (index: number) => {
    const phones = additionalPhones.filter((_: any, i: number) => i !== index);
    setAdditionalPhones(phones);
  };

  const removeLangue = (index: number) => {
    const updatedLangues = selectLangues.filter((_, i) => i !== index);
    setSelectLangues(updatedLangues);
  };

  const removeDocumentEntry = (index: number) => {
    const updatedDocuments = documentEntries.filter((_, i) => i !== index);
    setDocumentEntries(updatedDocuments);
  };

  const removeProfessionEntry = (index: number) => {
    const newEntries = professionEntries.filter((_: any, i: any) => i !== index);
    setProfessionEntries(newEntries);
  };

  const generateId = () => uuidv4();
  // console.log(generateId)

  const getAdditionalPhonesDataForSubmit = () => {
    // Возвращаем массив строк, не включая пустые значения
    return additionalPhones.filter((phone: string) => phone.trim() !== '');
  };

  const getDriveDataForSubmit = () => {
    return selectDrive;
  };

  const getProfessionsDataForSubmit = () => {
    return professionEntries.map((prof: { name: any; experience: any; }) => ({
      name: prof.name || '',
      experience: prof.experience || ''
    }));
  };


  

  const getLanguesDataForSubmit = () => {
    return selectLangues.map((lang) => ({
      name: lang.name || '',
      level: lang.level || '',
    }));
  };


  const handlePhoneBlur = async () => {
    if (selectPhone.trim() === '') {
      return;
    }
    try {
      const response = await fetch('/api/checkPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectPhone }),
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
  
    // Проверка на наличие кандидата
    if (!candidate || !candidate._id) {
      addNotification({
        title: 'Ошибка',
        content: 'Кандидат не найден. Проверьте данные.',
        type: 'error',
        id: uuidv4Original(),
      });
      return;
    }
  
    // Формируем FormData
    const formData = new FormData(event.target);
    const additionalPhonesData = getAdditionalPhonesDataForSubmit();
    const driveData = getDriveDataForSubmit();
    const professionsData = getProfessionsDataForSubmit();
    const languesData = getLanguesDataForSubmit();
  
    // Добавляем комментарии
    const commentData = formData.get('comment') ? [{
      authorId: managerId,
      author: managerId,
      text: formData.get('comment'),
      date: new Date().toISOString()
    }] : [];
  
    formData.append('managerId', managerId);
    formData.append('drivePermis', JSON.stringify(driveData)); 
    formData.append('professions', JSON.stringify(professionsData)); 
    formData.append('langue', JSON.stringify(languesData)); 
    formData.append('additionalPhones', JSON.stringify(additionalPhonesData));
    formData.append('comment', JSON.stringify(commentData));
  
    // Сформируем массив данных документов с мета-информацией
    const documentsData = documentEntries.map((doc, index) => {
      const documentObj: any = {
        docType: doc.docType || '',
        dateExp: doc.dateExp || '',
        dateOfIssue: doc.dateOfIssue || '',
        numberDoc: doc.numberDoc || '',
      };
  
      if (doc.file) {
        documentObj.file = doc.file;
      }
  
      return documentObj;
    });
  
    // Преобразуем массив в строку JSON и добавляем в FormData
    formData.append('documents', JSON.stringify(documentsData));
  
    // Для каждого файла добавляем его в отдельные поля FormData
    documentEntries.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`documents[${index}][file]`, doc.file); // Добавляем файл
      }
    });
  
    // Отправляем запрос на сервер
    try {
      const res = await fetch(`/api/candidates/${candidate._id}`, {
        method: 'PUT',
        body: formData,
      });
  
      const data = await res.json();
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
      console.error('Ошибка при редактировании кандидата:', error);
      addNotification({
        title: 'Ошибка',
        content: 'Произошла ошибка при редактировании кандидата.',
        type: 'error',
        id: uuidv4Original(),
      });
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 text-black-2 dark:text-white">
      <h2 className="text-center text-white text-2xl font-semibold mb-6">Добавить нового кандидата</h2>

      <form onSubmit={handleSubmit}
        className="grid grid-cols-[1fr_2fr_1fr] gap-4">

        {/* Личные данные */}
        <div className=" text-white">
          <h3 className="font-semibold text-lg mb-2 text-black-2 dark:text-white">Личные данные</h3>
          <DefaultInput id="name" label="ФИО"
            placeholder="Иван Иванов"
            value={selectesName}
            onChange={handleChangeName} />

          <div className='relative'>
            <DefaultInput id="phone" label="Телефон" type="text" placeholder="+373696855446"
              value={selectPhone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur} />
            <button type="button" className="absolute top-0 right-0 text-green-400 hover:text-green-700 transition duration-300 ease-in-out" onClick={addAdditionalPhone}><CirclePlus width={20} height={20} /></button>
          </div>

          {additionalPhones.map((phone: string | undefined, index: any) => (
            <div key={index} className="flex gap-2">
              <DefaultInput
                label={`${index + 1} телефон`}
                id={`additionalPhone${index}`} 
                name={`additionalPhone${index}`}
                type="phone"
                placeholder={phone}
                value={phone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAdditionalPhoneChange(index, e.target.value)}
              />

              <button
                type="button"
                className="btn-xs self-end pb-0.5 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                onClick={() => removeAdditionalPhone(index)}
              >
                <X />
              </button>
            </div>
          ))}

          <DefaultInput id="ageNum" label="Возраст" type="text"
            placeholder="33"
            value={selectAgeNum}
            onChange={handleChangeAgeNum} />
          <Select label={'Статус первого диалога'} id="status" name="status"
            options={status}
            value={selectStatus}
            onChange={handleChange} />

        </div>

        {/* Работа */}
        <div className=" flex flex-col gap-1">
          {/* <h3 className="font-semibold text-white text-lg mb-2">Профессии / Документы</h3> */}
          <label htmlFor="professions">
            <div className="flex justify-between items-start m-2">
              <h3 className="font-bold text-md text-black-2 dark:text-white">Профессии</h3>
              <button
                className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                type="button"
                onClick={addProfessionEntry}
              >
                <CirclePlus />
              </button>
            </div>
            {professionEntries.map((prof: { name: any; experience: any; }, index: any ) => (
              <div key={index} className='flex w-full  gap-1 pr-2'>
                <label htmlFor="profession">
                  <select className="text-sm  border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary"
                    value={prof.name || ''}
                    onChange={e => handleProfessionChange(index, 'name', e.target.value || '')}>
                    <option>Нет профессии</option>
                    {professions.map((profession: { _id: React.Key; name: string }) => (
                      <option key={profession._id} value={profession.name}>{profession.name}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="experience">
                  <select className="text-sm   border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" value={prof.experience || ''} onChange={e => handleProfessionChange(index, 'experience', e.target.value || '')}>
                    <option >Без опыта</option>
                    <option >Меньше года</option>
                    <option >Более года</option>
                    <option >От 2-х лет</option>
                    <option >Более 10-ти лет</option>
                  </select>
                </label>
                <button
                  className=" btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                  type="button" onClick={() => removeProfessionEntry(index)}><X /></button>
              </div>
            ))}
          </label>

          <div className='flex justify-between items-start m-2'>
            <h3 className="my-3 text-md font-bold">Документы </h3>
            <button className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out" type="button" onClick={addDocumentEntry}>
              <CirclePlus />
            </button>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            {documentEntries.map((doc, index) => (
              
              <Card key={index} className=' rounded-md'>
              <div  className=" flex m-3 mr-1">
                <p className="">{`${index + 1}.`}</p>
                <ImageDown onClick={() => handleClick(index)} style={{ cursor: 'pointer' }} />
          <input
            type="file"
            id={`fileInput-${index}`}  
            onChange={(e) => handleFileChange(e, index)}
            style={{ display: 'none' }}
          />
                <label htmlFor="nameDocument" className="flex flex-col items-center gap-2 relative">
                  <div className='flex  justify-center items-center'>
                    <select className="text-sm  h-[25px] border-stroke rounded-lg border-[1.5px]  bg-transparent p-0 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary"
                      value={doc.docType || ''}
                      onChange={e => handleDocumentChange(index, 'docType', e.target.value || '')}>
                      <option value="Не указано">Не указано</option>
                      <option value="Виза">Виза</option>
                      <option value="Песель">Песель</option>
                      <option value="Паспорт">Паспорт</option>
                      <option value="Паспорт ЕС">Паспорт ЕС</option>
                      <option value="Паспорт Биометрия Украины">Паспорт Биометрия Украины</option>
                      <option value="Параграф 24">Параграф 24</option>
                      <option value="Карта побыту">Карта побыту</option>
                      <option value="Геверба">Геверба</option>
                      <option value="Карта сталого побыта">Карта сталого побыта</option>
                      <option value="Приглашение">Приглашение</option>
                    </select>
                    <DefaultInputH placeholder='Номер документа' id='nunberDoc' label='#:' type="text"
                      value={doc.numberDoc}
                      onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'numberDoc', e.target.value)} />
                  </div>
                  <div className='flex justify-center items-center gap-3'>
                    <DefaultInput id='dateOfIssue' label='Выдан' type="date"
                      value={doc.dateOfIssue}
                      onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'dateOfIssue', e.target.value)} />
                    <DefaultInput id='documDate' label='До' type="date"
                      value={doc.dateExp}
                      onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'dateExp', e.target.value)} />
                  </div>
                  <div className='max-w-[50px]'>
  {/* Проверяем, что имя файла заканчивается на .jpg, .jpeg, или .png */}
  <DownloadButton data={doc.file} />
  {doc.file?.name && (doc.file.name.endsWith('.jpg') || doc.file.name.endsWith('.jpeg') || doc.file.name.endsWith('.png')) ? (
  
    <Dialog>
      <div className='flex items-center justify-center'>
      <DialogTrigger>
        <div className="text-sm text-gray-500 mt-2">
          <span>{doc.file?.name}</span>
        </div>
      </DialogTrigger>
      </div>
      <DialogContent className="w-full max-w-[600px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-sm text-gray-500 mt-2">{doc.file?.name}</span>
          </DialogTitle>
          <DialogDescription>
            {/* Здесь можно добавить описание */}
          </DialogDescription>
        </DialogHeader>
        <Image
          src={
            doc.file?.data && doc.file?.contentType
              ? `data:${doc.file.contentType};base64,${Buffer.from(doc.file.data).toString('base64')}`
              : '/images/logo/logo-dark.svg' // Путь к изображению по умолчанию, если данных нет
          }
          width={60}
          height={60}
          style={{
            width: '100%',
            height: '100%',
          }}
          alt={doc.file?.name ?? 'Документ'} // Подставляем имя файла или дефолтный текст
        />
      </DialogContent>
    </Dialog>
  ) : (
    // Если файл не подходит, просто показываем название
    <div className="text-sm text-gray-500 mt-2">
      <span>{doc.file?.name}</span>
    </div>
  )}
</div>

{/* {doc.file ? (
  <div className="text-sm text-gray-500 mt-2">
    <span>Выбран файл: {doc.file.name}</span>
  </div>
) : (
  <div className="text-sm text-gray-500 mt-2">
    <span>Файл не выбран</span>
  </div>
)}    */}
                  <button className="absolute right-0 top-0 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out self-end flex"
                    type="button" onClick={() => removeDocumentEntry(index)}><X /></button>
                </label>
              </div>
              </Card>
            ))}
          </div>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2">
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">
                Посмотреть все комментарии
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
              {commentEntries.length > 0 && (
                <div key={commentEntries.length - 1} className="flex gap-2 items-center">

                  <Badge>{new Date(commentEntries[commentEntries.length - 1].date)
                    .toLocaleString()
                    .slice(0, 5)} {/* Берем только день и месяц */}
                    .{new Date(commentEntries[commentEntries.length - 1].date)
                      .getFullYear()
                      .toString()
                      .slice(-2)} {/* Последние 2 цифры года */}</Badge>
                  <p className="text-sm">{commentEntries[commentEntries.length - 1].text}</p>
                </div>
              )}      </div>
            <CollapsibleContent>
              {commentEntries.map((comment, index: any) => (
                <div key={index} className="flex gap-2 items-center rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                  <Badge>{new Date(commentEntries[commentEntries.length - 1].date)
                    .toLocaleString()
                    .slice(0, 5)} 
                    .{new Date(commentEntries[commentEntries.length - 1].date)
                      .getFullYear()
                      .toString()
                      .slice(-2)} </Badge>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>



          <textarea
            id="comment" name="comment"
            rows={6}
            placeholder="Оставьте свой комментарий"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>

        </div>

        {/* Дополнительно */}
        <div >
          <h3 className="font-semibold text-lg mb-2">Дополнительно</h3>
          <Select label={'Гражданство'} id="citizenship" name="citizenship"
            value={selectCitizenship}
            placeholder='Выберите гражданство' options={citizenshipOptions}
            onChange={(e: any) => setSelectCititzenship(e.target.value)} />
          <DefaultInput id='leaving' label='Готов выехать' type="date"
            value={leavingDate}
            onChange={(e: any) => setLeavingDate(e.target.value)}
          />
          <DefaultInput label="Местоположение" id='locations' name='locations'
            value={selectLocations}
            onChange={(e: any) => setSelectLocations(e.target.value)}
          />
          <MyMultiSelect
            label="Водительское удостоверение"
            options={drivePermis}
            placeholder="Категории В/У"
            className="w-full my-1 text-sm"
            value={candidate?.drivePermis || []} 
            onChange={handleDriveChange}
            id="drivePermis"
          />

          <DefaultInput id='cardNumber' label='Номер счёта' type="text"
            value={selectCardNumber}
            onChange={(e: any) => setSelectCardNumber(e.target.value)} />
          <div className='flex justify-between items-center m-2'>
            <h3 className="my-3 text-md font-bold">Языки</h3>
            <button className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out" type="button" onClick={addLangue}>
              <CirclePlus />
            </button>
          </div>

          {/* Отображение списка языков */}
          <div className='flex flex-col gap-2 w-full'>
            {selectLangues.map((lang, index) => (
              
              <div key={index} className="flex flex-col gap-2">
                <label htmlFor={`langue-${index}`} className="flex flex-col gap-1 items-start relative">
                  {/* Язык */}
                  <div className='flex flex-col justify-between items-start '>
                    <div>Знание языка</div>
                    <select
                      id={`langue-${index}`}
                      name={`langue-${index}`}
                      className="text-sm w-[250px] h-[25px] border-stroke rounded-lg border-[1.5px] bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={lang.name}
                      onChange={(e) => handleLangueChange(index, 'name', e.target.value)}
                    >
                      <option value='Не знает языков'>Не знает языков</option>
                      <option value='Немецкий'>Немецкий</option>
                      <option value='Английский'>Английский</option>
                      <option value='Польский'>Польский</option>
                      <option value='Турецкий'>Турецкий</option>
                      <option value='Французский'>Французский</option>
                      <option value='Итальянский'>Итальянский</option>
                    </select>
                  </div>

                  {/* Уровень */}
                  <div className='flex flex-col justify-between items-start '>
                    <div>Уровень</div>
                    <select
                      className="text-sm h-[25px] w-[250px] border-stroke rounded-lg border-[1.5px] bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={lang.level}
                      onChange={(e) => handleLangueChange(index, 'level', e.target.value)}
                    >
                      <option value=''>Выберите уровень</option>
                      <option value='Самоучка'>Самоучка</option>
                      <option value='Уровень А1'>Уровень А1</option>
                      <option value='Уровень А2'>Уровень А2</option>
                      <option value='Уровень B1'>Уровень B1</option>
                      <option value='Уровень B2'>Уровень B2</option>
                    </select>
                  </div>
                  {/* Кнопка для удаления языка */}
                  <button
                    className="absolute right-2 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out self-end flex"
                    type="button"
                    onClick={() => removeLangue(index)}
                  >
                    <X />
                  </button>
                </label>


              </div>
            ))}
          </div>

        </div>


        {/* Кнопка отправки формы */}
        <div className="col-span-full mt-6 text-center">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCandidateForm;
function uuidv4(): string {
  throw new Error('Function not implemented.');
}

