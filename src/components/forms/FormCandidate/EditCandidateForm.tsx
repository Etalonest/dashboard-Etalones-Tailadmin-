'use client'
import React, { useEffect, useState } from 'react';
import { CirclePlus, Download, ImageDown, Save, X } from 'lucide-react';
import Select from '../../inputs/Select/Select';
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import { useSession } from 'next-auth/react';
import { drivePermisData, citizenshipOptions, langueLevelData, languesData } from '@/src/config/constants'
import { DocumentEntry, Langue, CommentEntry } from "../interfaces/FormCandidate.interface"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge';
import { useProfessionContext } from "@/src/context/ProfessionContext";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CMultiSelect from '../../Multiselect/Multiselect';
import { DocumentChoise } from './DocumentChoise/DocumentChoise';
import { WorkUpChoise } from './WorkUpChoise/WorkUpChoise';
import useCandidateData from '@/src/hooks/useCandidateData';
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
import { Textarea } from '@/components/ui/textarea';
import Funnel from '../Funnel/Funnel';
const EditCandidateForm = ({ candidate,onSubmitSuccess }: any) => {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();
  const { professions } = useProfessionContext();
  const [funnelData, setFunnelData] = useState({});
  const [selectPhone, setSelectPhone] = useState(candidate?.phone || "");
  const [additionalPhones, setAdditionalPhones] = useState(candidate?.additionalPhones || []);
  const [professionEntries, setProfessionEntries] = useState(candidate?.professions || []);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>(candidate?.documents || []);
  const [commentEntries, setCommentEntries] = useState<CommentEntry[]>(candidate?.comment || []);
  const [selectDrive, setSelectDrive] = useState(candidate?.drivePermis || []);
  const [selectLangues, setSelectLangues] = useState<Langue[]>(candidate?.langue || []);
  const [workStatuses, setWorkStatuses] = useState<{ name: string; date: Date }[]>(candidate?.statusWork || []);
  const {
    name,
    phone,
    ageNum,
    locations,
    drivePermis,
    documents,
    citizenship,
    handleChangeName,
    handleChangePhone,
    handleChangeAge,
    handleChangeLocations,
  } = useCandidateData(candidate);
  const managerId = session?.managerId ?? 'defaultManagerId';
  const userName = session?.user?.name ?? 'defaultManagerName';
  
  
  useEffect(() => {
    if (candidate?.statusWork) {
      setWorkStatuses(candidate.statusWork);
    }
  },  [candidate?.statusWork]);

  useEffect(() => {
    if (candidate?.phone) { setSelectPhone(candidate.phone); }
  }, [candidate?.phone]);
  useEffect(() => {
    if (candidate?.additionalPhones) { setAdditionalPhones(candidate.additionalPhones); }
  }, [candidate?.additionalPhones]);
 

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
    if (candidate?.drivePermis) { setSelectDrive(candidate.drivePermis); }
  }, [candidate?.drivePermis]);

  useEffect(() => {
    if (candidate?.langue) {
      setSelectLangues(candidate.langue);
    }
  }, [candidate?.langue]);

  const handleDataChange = (updatedFunnelData: any) => {
    setFunnelData(updatedFunnelData); 
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setDocumentEntries(prevEntries => {
        const updatedDocuments = [...prevEntries];
        updatedDocuments[index].file = selectedFile;
        return updatedDocuments;
      });
    }
  };
  const handleStatusesChange = (selectWS: string[]) => {
    const updatedWS = selectWS.map(name => ({
       name: name,
       date: new Date()
     }));
    
     setWorkStatuses(updatedWS);
   };
  

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectPhone(e.target.value);
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

  const handleDocumentChange = (selectedDocuments: any[]) => {
    const updatedDocuments = selectedDocuments.map((docType, index) => ({
      docType: docType,
      dateExp: '',  
      dateOfIssue: '', 
      numberDoc: '',
      file: documentEntries[index]?.file || undefined, 
    }));

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
    setProfessionEntries([...professionEntries, { name: 'Нет профессии', expirience: '' }]);
  };




  const removeAdditionalPhone = (index: number) => {
    const phones = additionalPhones.filter((_: any, i: number) => i !== index);
    setAdditionalPhones(phones);
  };

  const removeLangue = (index: number) => {
    const updatedLangues = selectLangues.filter((_, i) => i !== index);
    setSelectLangues(updatedLangues);
  };
  const getLanguesDataForSubmit = () => {
    return selectLangues.map((lang) => ({
      name: lang.name || '',
      level: lang.level || '',
    }));
  };
  const removeDocumentEntry = (index: number) => {
    const updatedDocuments = documentEntries.filter((_, i) => i !== index);
    setDocumentEntries(updatedDocuments);
  };

  const removeProfessionEntry = (index: number) => {
    const newEntries = professionEntries.filter((_: any, i: any) => i !== index);
    setProfessionEntries(newEntries);
  };

  const getSWforSubmit = () => {
    return workStatuses.map(status => ({
      name: status.name,
      date: status.date
    }));
  };
  const getAdditionalPhonesDataForSubmit = () => {
    // Возвращаем массив строк, не включая пустые значения
    return additionalPhones.filter((phone: string) => phone.trim() !== '');
  };

  const getDriveDataForSubmit = () => {
    return selectDrive;
  };
  const getCommentData = (formData: FormData, userName: string) => {
    const commentText = formData.get('comment');
  
    if (commentText) {
      const commentData = {
        author: userName,       // Имя автора
        text: commentText,      // Текст комментария
        date: new Date().toISOString(),  // Дата добавления комментария
      };
      return commentData; 
    }
  
    return null; // Если комментарий не передан, возвращаем null
  };
  
  
  
  const getProfessionsDataForSubmit = () => {
    return professionEntries.map((prof: { name: any; expirience: any; }) => ({
      name: prof.name || '',
      expirience: prof.expirience || ''
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
  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${fileId}`, {
        method: 'GET', 
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Error downloading file");
        addNotification({
          title: "Ошибка",
          content: "Не удалось скачать файл",
          type: "error",
          id: "",
        });
      }
    } catch (error: any) {
      console.error("Network error during download:", error);
      addNotification({
        title: "Ошибка",
        content: `Сетевая ошибка: ${error.message}`,
        type: "error",
        id: "",
      });
    }
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
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
    const workStatusesData = getSWforSubmit();
    const commentData = getCommentData(formData, userName);
    if (commentData) {
      formData.set('comment', JSON.stringify(commentData)); 
    }    
    formData.append('funnel', JSON.stringify(funnelData));
    formData.append('name', name)
    formData.append('managerId', managerId);
    formData.append('drivePermis', JSON.stringify(driveData)); 
    formData.append('professions', JSON.stringify(professionsData)); 
    formData.append('langue', JSON.stringify(languesData)); 
    formData.append('additionalPhones', JSON.stringify(additionalPhonesData));
    formData.append('workStatuses', JSON.stringify(workStatusesData));
    formData.append(managerId, JSON.stringify(managerId));
    const documentsData = documentEntries.map((doc, index) => {
      const documentObj: any = {
        docType: doc.docType || '',
        dateExp: doc.dateExp || '',
        dateOfIssue: doc.dateOfIssue || '',
        numberDoc: doc.numberDoc || '',
        file: doc.file || null,
      };
  
      if (doc.file) {
        documentObj.file = doc.file;
      }
  
      return documentObj;
    });
  
    formData.append('documents', JSON.stringify(documentsData));
  
    documentEntries.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`documents[${index}][file]`, doc.file  as Blob); 
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
      console.log("DATA", data)
  
      if (data.success) {
        addNotification({
          title: 'Успешно',
          content: message,
          type: 'success',
          id: uuidv4Original(),
        });
        onSubmitSuccess();
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
    <div>
    <h2 className="text-center text-black text-2xl font-semibold mb-2">Редактировать {name}</h2>
    <div className='container mx-auto flex'>
    <form onSubmit={handleSubmit} className='flex-1 '>
      <div className="p-2">
        <Card className='p-5'>

          <CardHeader className='grid grid-cols-3 gap-2'>
          <CardTitle className="col-span-1">Документ</CardTitle>
          <div className="col-span-2">
          <DocumentChoise 
          initialSelectedDocuments={documents}
          onDocumentsChange={handleDocumentChange} />
          <div className='w-full h-[2px] bg-gray-300 my-2 mr-5 rounded-md'></div>
          </div>
          <div className='w-full flex'>
            <CardTitle>Загруженые документы</CardTitle>
  {documentEntries.map((doc: any, index: any) => (
    <div key={index} className='flex justify-center p-5 wlex-wrap gap-2'>
      <Drawer>
        <DrawerTrigger >
          <Card className='p-1'>
            <CardTitle>
              {doc?.docType}
            </CardTitle>
            <CardDescription className='p-1 text-gray-400 flex gap-1 items-center  w-max'>
              {doc?.file?.name || "Нет загруженого файла"} 
             <Download size={18} />
            </CardDescription>
          </Card>
        </DrawerTrigger>
        <DrawerContent className='text-black'>
          <DrawerHeader >
            <DrawerTitle>{doc?.docType}</DrawerTitle>
            <div className='flex justify-center items-center gap-2 '>
            <DrawerDescription className='text-gray-400'>{doc?.file?.name || "Нет загруженого документа"}</DrawerDescription>
            <div className="flex gap-2 items-center">
                  <button onClick={() => downloadFile(doc?.file?._id, doc.file.name)} >
                  <Download />
                  </button>
                </div>
            </div>
          </DrawerHeader>
          <DrawerFooter >
            <div className='flex gap-2 items-center justify-center'>
            <div className="grid w-full max-w-sm  gap-1.5">
      <Input id="picture" type="file" 
      placeholder={doc?.file?.name}
      onChange={(e) => handleFileChange(e, index)} />
    </div>           
            </div>
            <DrawerClose className='absolute top-2 right-2'>
              <X size={18} color="red"/>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ))}
  <Drawer>
    <DrawerTrigger>
  <CirclePlus color='green' />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
      Добавить документ
        </DrawerTitle>
        <DrawerDescription className='text-gray-400'>Выберите какой документ вы хотите добавить</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter >
            <div className='flex gap-2 items-center justify-center'>
            <Button>Загрузить</Button>
            <Button>Скачать</Button>
            </div>
            <DrawerClose className='absolute top-2 right-2'>
             <X size={18} color="red"/>
            </DrawerClose>
          </DrawerFooter>
    </DrawerContent>
  </Drawer>
</div>
<div className='col-span-3'>
          <CardTitle className="col-span-1">Готовность к работе</CardTitle>
          <div className="col-span-2">
          <WorkUpChoise  
          initialSelectedStatuses={workStatuses}
          onStatusesChange={handleStatusesChange}
          />
          </div>
          </div>
          </CardHeader>
          <CardContent className='mt-0 grid grid-cols-2 gap-2'>
            <div>
            <Label>ФИО</Label>
            <Input placeholder="Имя" name='name' id='name'
            value={name}
            onChange={handleChangeName} />
            </div>
            <div>
            <Label>Возраст</Label>
            <Input placeholder="33" name='ageNum'
            value={ageNum}
            onChange={handleChangeAge}
            />
            </div><div className='relative'>
            <Label>Телефон</Label>
            <Input placeholder="+495651322654" name='phone'
            value={phone}
            id='phone'
            onBlur={handlePhoneBlur}
            onChange={handleChangePhone}
            />            <button type="button" className="absolute top-8 right-1 text-green-800 hover:text-green-500 transition duration-300 ease-in-out" 
            onClick={addAdditionalPhone}><CirclePlus width={20} height={20} /></button>

            {additionalPhones.map((phone: string | undefined, index: any) => (
              <div key={index} className="flex gap-2 justify-center items-center mt-1 relative">
                <Label>{index + 2}.</Label>
            <Input placeholder="+495651322654" 
          id={`additionalPhone${index}`}
          name={`additionalPhone${index}`}
          type="phone"
          value={additionalPhones[index]}
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
              <CirclePlus size={20}/>
            </button>
              </div>
            {professionEntries.map((prof: { name: any; expirience: any; }, index: any) => (
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
            <Select label={'Гражданство'} id="citizenship" name="citizenship" placeholder='Выберите гражданство' 
            value={citizenship}
            options={citizenshipOptions} />
            <div>
            <Label>Местоположение</Label>
            <Input placeholder="Минск, Беларусь" name='locations'
            value={locations}
            onChange={handleChangeLocations}
            />
            </div><div>
            <Label>Водительское удостоверение</Label>
            <CMultiSelect options={drivePermisData} 
            value={Array.isArray(drivePermis) ? drivePermis : [drivePermis]}            
            placeholder={'Выбериите категории'}
            onChange={handleDriveChange} />
            </div> 



            <div >
            <div className='relative'>
            <button className="absolute top-0 right-0 btn-xs text-green-800 hover:text-green-500 transition duration-300 ease-in-out" 
            type="button" onClick={addLangue}>
            <CirclePlus size={20}/>
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
              <CirclePlus size={20}/>
            </button>
              </div>
          {selectLangues.map((lang: { name: unknown; level: unknown; }, index: any) => (
            <div key={index} className='relative grid grid-cols-2 gap-2'>
                  <Select  id={''} options={languesData} 
                    placeholder='Выберите язык'
                    value={lang.name}
                    onChange={(e:any) => handleLangueChange(index, 'name', e.target.value)}
                    name={`langue-${index}`} />
                <div className='w-[85%]'>
                  <Select  id={''} options={langueLevelData}
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
      
        <Card className='p-4'>
<CardContent>
  <CardTitle>Комментарий</CardTitle>
  {commentEntries.map((comment, index) => (
  <div key={index} className="relative flex gap-2 items-center rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
    <Badge>
      {new Date(comment.date)
        .toLocaleString()
        .slice(0, 5)}.
      {new Date(comment.date)
        .getFullYear()
        .toString()
        .slice(-2)}
    </Badge>
    <Badge className='text-green-700'>
      {new Date(comment.date)
        .toLocaleString()
        .slice(12, 17)}
    </Badge>
    <p className="text-sm">{comment.text}</p>
    <span className='absolute right-2'>Автор: {comment.author}</span>
  </div>
))}

  <Textarea
    placeholder="Оставьте свой комментарий"
    className="mt-5"
 id="comment" name="comment"
        />
</CardContent>
</Card>

      </div>
  
      <div className="col-span-full mt-6 text-center">
      <Button type="submit" className="fixed top-4 right-5 bg-green-900 text-white hover:bg-green-700">
          Сохранить
        </Button>
      </div>
    </form>
    <div className='flex-2 p-2'>
    <Funnel
    candidate={candidate} />
    </div>
    </div>
    </div>
  );
};

export default EditCandidateForm;

