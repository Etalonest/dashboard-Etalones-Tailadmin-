'use client'
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import AutocompleteInput from '../../AutocompleteInput/AutocompleteInput';
import { suggestionsData } from '@/src/config/suggestions';
import CMultiSelect from '../../Multiselect/Multiselect';
import { drivePermisData, expiriences, languesData, pDocsData } from '@/src/config/constants';
import { Car, CirclePlus, Download, PencilLine, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CommentEntry, DocumentEntry} from '../interfaces/FormCandidate.interface';
import { ProfessionPartner } from '@/src/types/professionParnter';
import usePartnerData from '@/src/utils/usePartnerData';
import { useProfessionContext } from "@/src/context/ProfessionContext";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { DocumentChoise } from './DocumentChoise/DocumentChoise';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar } from '@radix-ui/react-avatar';
import Image from 'next/image';
import { InputTransparent } from '../../inputs/inputTransparent';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { PopoverContent } from '@/components/ui/popover';

const EditpartnerForm = ({partner, onSubmitSuccess}: any) => {
  const { professions } = useProfessionContext();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'defaultManagerName';
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
    documents,
    selectSite,
    contract,
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
    handleChangeDocuments,
    handleChangeContract,
  } = usePartnerData(partner);
  const [commentEntries, setCommentEntries] = useState<CommentEntry[]>(partner?.comment || []);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>(partner?.documents || []);
  const [professionsPartner, setProfessionsPartner] = useState<ProfessionPartner[]>(
    partner?.professions || []  
  );  


   useEffect(() => {
      if (partner?.comment) { setCommentEntries(partner.comment); }
    }, [partner?.comment]);
   useEffect(() => {
      if (partner?.professions) { setProfessionsPartner(partner.professions); }
    }, [partner?.professions]);
      
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setDocumentEntries(prevEntries => {
        const updatedDocuments = [...prevEntries];
        if (!updatedDocuments[index]) {
          updatedDocuments[index] = {  
            docType: '',          
            dateExp: '',          
            dateOfIssue: '',      
            numberDoc: '',        
            file: null   }; 
        }
        updatedDocuments[index].file = selectedFile;
        return updatedDocuments;
      });
    }
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
      pDocs: [],
      getStart: new Date(),
      candidates: [],
      interview: []
    };

    setProfessionsPartner((prevProfessions) => [...prevProfessions, newProfession]);
  };

  const handleProfessionSelect = (index: number, field: string, value: string) => {
    const newEntries = professionsPartner.map((profession, i) => {
      if (i === index) {
        return { ...profession, [field]: value };
      }
      return profession;
    });
  
    // Обновляем состояние с новым массивом
    setProfessionsPartner(newEntries);
  };
  
  const handleInputPChange = (index: number, field: string, value: string) => {
    const newEntries = [...professionsPartner]; // Создаем новый массив
    newEntries[index] = { 
      ...newEntries[index], 
      [field]: value // Обновляем поле, переданное в `field` (например, 'place')
    };
    setProfessionsPartner(newEntries); // Обновляем состояние с новым массивом
  };

  const handleDrivePChange = (selectedDriveP: string[], index: number) => {
    setProfessionsPartner((prevProfessions) =>
      prevProfessions.map((prof, idx) =>
        idx === index ? { ...prof, drivePermis: selectedDriveP } : prof
      )
    );
  };
  const handleLangues = (selectedLangues: string[], index: number) => {
    setProfessionsPartner((prevProfessions) =>
      prevProfessions.map((prof, idx) =>
        idx === index ? { ...prof, langue: selectedLangues } : prof
      )
    );
  };
  
  const handlePDocs = (selectedPDocs: string[], index: number) => {
    setProfessionsPartner((prevProfessions) =>
      prevProfessions.map((prof, idx) =>
        idx === index ? { ...prof, pDocs: selectedPDocs } : prof
      )
    );
  };
  

  const getCommentData = (formData: FormData, userName: string) => {
      const commentText = formData.get('comment');
    
      if (commentText !== '') {
        const commentData = {
          author: userName,       
          text: commentText,      
          date: new Date().toISOString(),  
        };
        console.log('Созданный объект комментария:', commentData); 
        return commentData; 
      }
    
      return null; 
    };
  const getProfessionsDataForSubmit = () => {
    console.log("Профессии для отправки", professions);
    return professionsPartner.map((prof) => ({
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
      pDocs: prof.pDocs || [],
    }));
  };
  
  const handleRemoveProfession = (index: number) => {
    setProfessionsPartner((prevProfessions) =>
      prevProfessions.filter((_, i) => i !== index) // Удаляем элемент по индексу
    );
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
    if (!partner || !partner._id) {
          addNotification({
            title: 'Ошибка',
            content: 'Партнёр не найден. Проверьте данные.',
            type: 'error',
            id: uuidv4Original(),
          });
          return;
        }
    const formData = new FormData(event.target);
    const professionsData = getProfessionsDataForSubmit();
    const commentData = getCommentData(formData, userName);
    if (commentData) {
      formData.set('comment', JSON.stringify(commentData)); 
    }  
    formData.append('managerId', managerId);
    formData.append('professions', JSON.stringify(professionsData));
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
    try {
      const response = await fetch(`/api/partner/${partner._id}`, {
        method: 'PUT',
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
      console.error('Ошибка при добавлении кандидата:', error);
    }
  };
 console.log("DOCUMENTS", partner); 
  return (
    <div className='container mx-auto flex justify-center'>
    <form onSubmit={handleSubmit} >   
      <Card>
        <CardHeader className='grid grid-cols-3 gap-2'>
        <Image src="/images/user/user-01.png" className='w-16 h-16 rounded-full' width={400} height={400} alt="user" />
        <InputTransparent placeholder="Имя" name='name'/>
        <InputTransparent placeholder="Телефон" name='phone'/>
        <Popover>
          <PopoverTrigger>
            <Button type='button' variant="link" >Соцсети</Button>
          </PopoverTrigger>
          <PopoverContent>
          <div>
                    <Label>Viber</Label>
                    <Input placeholder="+495651322654" name='viber'
                      value={selectViber || ''}
                      onChange={handleChangeViber} />
                  </div>
                  <div>
                    <Label>Whatsapp</Label>
                    <Input placeholder="+495651322654" name='whatsapp'
                      value={selectWhatsapp || ''}
                      onChange={handleChangeWhatsapp} />
                  </div>
                  <div>
                    <Label>Telegram</Label>
                    <Input placeholder="+495651322654" name='telegram'
                      value={selectTelegram || ''}
                      onChange={handleChangeTelegram} />
                  </div>
                  <div>
                    <Label>Почта</Label>
                    <Input placeholder="mail@gmail.com" name='email'
                      value={selectEmail || ''}
                      onChange={handleChangeEmail} />
                  </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button type='button' variant="link" >Фирма</Button>
          </PopoverTrigger>
          <PopoverContent>
          <div>
                    <Label>Название фирмы</Label>
                    <Input placeholder="GMBH gfgtg" name='companyName'
                      value={selectCompanyName || ''}
                      onChange={handleChangeCompanyName} />
                  </div>
                  <div>
                    <Label>Номер DE</Label>
                    <Input placeholder="DE495651322654" name='numberDE'
                      value={selectNumberDE || ''}
                      onChange={handleChangeNumberDE} />
                  </div>
                  <div>
                    <Label>Местоположение</Label>
                    <Input placeholder="Дюсельдорф" name='location'
                      value={selectLocation || ''}
                      onChange={handleChangeLocation} />
                  </div>
                  <div>
                    <Label>Сайт</Label>
                    <Input placeholder="www.site.com" name='site'
                      value={selectSite || ''}
                      onChange={handleChangeSite} />
                  </div>
                  <div className='col-span-2 grid grid-cols-3 gap-2'>
                  <div>
                    <Label>Тип контракта</Label>
                  <Input
                    name='typeC'
                    value={contract.typeC}
                    placeholder="Введите тип контракта"
                    onChange={(e) => handleChangeContract(e, 'typeC')} />
                    </div>
                    <div>
                      <Label>Сумма контракта</Label>
                  <Input
                    name='contractPrice'
                    value={contract.sum}
                    placeholder="Введите цену контракта"
                    onChange={(e) => handleChangeContract(e, 'contractPrice')} />
                    </div>
                    <div>
                      <Label>Минимальная зарплата работника</Label>
                    <Input
                    name='salaryWorker'
                    value={contract.salaryWorker}
                    placeholder="Введите минимальную зарплату работника"
                    onChange={(e) => handleChangeContract(e, 'salaryWorker')} />
                    </div>
                  </div>
          </PopoverContent>
        </Popover><Popover>
          <PopoverTrigger>
            <Button type='button' variant="link" >Комментарии</Button>
          </PopoverTrigger>
          <PopoverContent>
          <Textarea
                    placeholder="Оставьте свой комментарий"
                    className="my-5 "
                    id="comment" name="comment"/>
  <ScrollArea className="max-h-50 rounded-md border">
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
    <span className=''>Автор: {comment.author}</span>
  </div>
))}
</ScrollArea> 
          </PopoverContent>
        </Popover>
        </CardHeader>
<CardContent className='mt-0 grid grid-cols-2 gap-2'>

</CardContent>
      </Card>
            <div className="p-2">
              {/* <Card>
                <CardHeader className='grid grid-cols-3 gap-2'>
                  <CardTitle className='col-span-3 flex justify-end items-center gap-2'><PencilLine/><span> {selectName}</span></CardTitle>
                  <DocumentChoise 
          initialSelectedDocuments={documents}
          onDocumentsChange={handleDocumentChange} />
          <Drawer>
    <DrawerTrigger>
  <Button type='button'  variant="outline" >Добавить файл</Button>
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
          {documents.map((doc: any, index: any) => (
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
                </CardHeader>
                <CardContent className='mt-0 grid grid-cols-2 gap-2'>
                <CardTitle>
                    <Label>ФИО</Label>
                    <Input placeholder="Имя" name='name'
                      value={selectName || ''}
                      onChange={handleChangeName} />
                       <Label>Телефон</Label>
                    <Input placeholder="+495651322654" name='phone'
                      value={selectPhone || ''}
                      onChange={handleChangePhone} />
                      <div>
                  <HoverCard>
                    <HoverCardTrigger>
                    <Button type='button' variant="link">Соцсети</Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                    <div>
                    <Label>Viber</Label>
                    <Input placeholder="+495651322654" name='viber'
                      value={selectViber || ''}
                      onChange={handleChangeViber} />
                  </div>
                  <div>
                    <Label>Whatsapp</Label>
                    <Input placeholder="+495651322654" name='whatsapp'
                      value={selectWhatsapp || ''}
                      onChange={handleChangeWhatsapp} />
                  </div>
                  <div>
                    <Label>Telegram</Label>
                    <Input placeholder="+495651322654" name='telegram'
                      value={selectTelegram || ''}
                      onChange={handleChangeTelegram} />
                  </div>
                  <div>
                    <Label>Почта</Label>
                    <Input placeholder="mail@gmail.com" name='email'
                      value={selectEmail || ''}
                      onChange={handleChangeEmail} />
                  </div>
                    </HoverCardContent>

                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger>
                    <Button type='button' variant="link">Фирма</Button>
                    </HoverCardTrigger>
                    <HoverCardContent >
                    <div>
                    <Label>Название фирмы</Label>
                    <Input placeholder="GMBH gfgtg" name='companyName'
                      value={selectCompanyName || ''}
                      onChange={handleChangeCompanyName} />
                  </div>
                  <div>
                    <Label>Номер DE</Label>
                    <Input placeholder="DE495651322654" name='numberDE'
                      value={selectNumberDE || ''}
                      onChange={handleChangeNumberDE} />
                  </div>
                  <div>
                    <Label>Местоположение</Label>
                    <Input placeholder="Дюсельдорф" name='location'
                      value={selectLocation || ''}
                      onChange={handleChangeLocation} />
                  </div>
                  <div>
                    <Label>Сайт</Label>
                    <Input placeholder="www.site.com" name='site'
                      value={selectSite || ''}
                      onChange={handleChangeSite} />
                  </div>
                  <div className='col-span-2 grid grid-cols-3 gap-2'>
                  <Input
                    name='typeC'
                    value={contract.typeC}
                    placeholder="Введите тип контракта"
                    onChange={(e) => handleChangeContract(e, 'typeC')} />
                  <Input
                    name='contractPrice'
                    value={contract.sum}
                    placeholder="Введите цену контракта"
                    onChange={(e) => handleChangeContract(e, 'contractPrice')} />
                    <Input
                    name='salaryWorker'
                    value={contract.salaryWorker}
                    placeholder="Введите минимальную зарплату работника"
                    onChange={(e) => handleChangeContract(e, 'salaryWorker')} />
                  </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger>
                    <Button type='button' variant="link">Комментарии:</Button>
                    </HoverCardTrigger>
                    <HoverCardContent >
                    <Textarea
                    placeholder="Оставьте свой комментарий"
                    className="mt-5"
                    id="comment" name="comment"/>
  <ScrollArea className="max-h-50 w-full rounded-md border">
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
</ScrollArea>
                    </HoverCardContent>
                  </HoverCard>
                  </div>
                  </CardTitle>       
                </CardContent>
              </Card> */}
            </div>
        
      {/* <div className="mt-8 w-full bg-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Button variant="outline" 
                  onClick={handleButtonClick} type='button'>
                  Добавить профессию</Button>
        {professionsPartner.map((profession: any, index: any) => (

          <div key={index} className=" p-4 mb-4 ">
            <Card className='relative '>
              <Button
                type='button'
                variant="outline"
                className="bg-red-600 text-white absolute right-2 top-2 p-2 w-max h-8"
                onClick={() => handleRemoveProfession(index)}
              >
                <X size={15} />
              </Button>
              <span className='m-1 font-bold'>{index + 1}.</span>
              <CardTitle className='grid grid-cols-2 gap-1 relative pt-10 px-6'>
                <div>
                <Label>Название профессии:</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                    value={profession?.name || ''}
                    onChange={(e) => {const selectedName = e.target.value;
                      handleProfessionSelect(index, 'name', selectedName);} }
                  >
                    <option value="">Нет профессии</option>
                    {professions.map((profession: any, index: number) => (
                      <option key={index} value={profession.name} data-id={profession.id}>
                        {profession.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <AutocompleteInput
                  value={profession?.location || ''}
                  label="Местоположение"
                  suggestions={suggestionsData.location}
                  placeholder="Укажите местоположение"
                  onChange={(value) => handleInputPChange(index, 'location', value)} />
                </div>

              </CardTitle>
              <CardContent className='flex flex-col gap-2'>
                <div className='grid grid-cols-2 gap-2 '>
                  <AutocompleteInput
                    value={profession?.skills}
                    label="Навыки"
                    suggestions={suggestionsData.skils}
                    placeholder="Укажите набор навыков"
                    onChange={(value) => handleInputPChange(index, 'skills', value)} />
                  <div>
                    <Label>Опыт работы</Label>
                    <label htmlFor="profession">
                      <select
                        className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                        value={profession?.experience || ''}
                         onChange={(e) => {const selectedName = e.target.value;
                      handleProfessionSelect(index, 'experience', selectedName);} }
                      >
                        <option value="">Нет опыта</option>
                        {expiriences.map((experience: any) => (
                          <option key={experience?.value} value={experience?.name} data-id={profession?.id}>
                            {experience?.value}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>


                <div className='grid grid-cols-2 gap-2'>
                  <AutocompleteInput
                    label="Зарплата"
                    suggestions={suggestionsData.sallary}
                    placeholder="Зарплата работника"
                    value={profession?.salary || ''}
                    onChange={(value) => handleInputPChange(index, 'sallary', value)} />
                  <AutocompleteInput
                    label="Цена проживания"
                    suggestions={suggestionsData.homePrice}
                    value={profession?.rentPrice || ''}
                    placeholder="Стоимость проживания"
                    onChange={(value) => handleInputPChange(index, 'rentPrice', value)} />
                </div>
                <div className='grid grid-cols-2 gap-2'>

                  <AutocompleteInput
                    label="Авансы"
                    suggestions={suggestionsData.avance}
                    value={profession?.avans || ''}
                    placeholder="Отношение к авансу"
                    onChange={(value) => handleInputPChange(index, 'avans', value)} />
                  <AutocompleteInput
                    label="Спецодежда"
                    suggestions={suggestionsData.workwear}
                    value={profession?.workwear || ''}
                    placeholder="Спецодежда"
                    onChange={(value) => handleInputPChange(index, 'workwear', value)} />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <Label>Наличие В/У</Label>
                    <CMultiSelect options={drivePermisData} placeholder={'Выбериите категории'}
                      value={profession?.drivePermis || []}
                      onChange={(selectedDriveP: string[]) => handleDrivePChange(selectedDriveP, index)} />
                  </div>
                  <div>
                    <Label>Знание языков</Label>
                    <CMultiSelect options={languesData} placeholder={'Выберите языки'}
                      value={profession?.langue || []}
                      onChange={(selectedLangues: string[]) => handleLangues(selectedLangues, index)} />

                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>

                  <AutocompleteInput
                    label="Часы отработки"
                    suggestions={suggestionsData.wHours}
                    value={profession?.workHours || ''}
                    placeholder="Количество часов отработки"
                    onChange={(value) => handleInputPChange(index, 'workHours', value)} />
                  <div>
                    <Label>Свободные места</Label>
                    <Input type='number' placeholder="Введите количество свободных мест"
                      value={profession?.place}
                      onChange={(e) => handleInputPChange(index, 'place', e.target.value)} />
                  </div>
                  <div>
                  <Label>Набор открыт с:</Label>
                  <Input type='date' placeholder="Введите дату открытия"
                    value={profession?.getStart ? new Date(profession.getStart).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputPChange(index, 'getStart', e.target.value)} />
                </div>
                <div>
                  <Label>Подходящие документы</Label>
                  <CMultiSelect options={pDocsData} placeholder={'Выберите документы'}
                      value={profession?.pDocs || []}
                      onChange={(selectedPDocs: string[]) => handlePDocs(selectedPDocs, index)} 
                      />
                </div>
                </div>
               
              </CardContent>
            </Card>


          </div>
        ))}
      </div> */}
      <Button
        className='fixed top-4 right-4 bg-slate-100 border-2 border-green-800 text-green-800 hover:bg-slate-200 '
        type='submit'>Сохранить обновления</Button>

    </form>
</div>

       
  );
};

export default EditpartnerForm;

