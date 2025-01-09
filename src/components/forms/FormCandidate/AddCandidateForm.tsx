'use client'
import React, { useContext, useState } from 'react';
import DefaultInput from '../../inputs/DefaultInput/DefaultInput';
import { CirclePlus, FileUp, X } from 'lucide-react';
import Select from '../../inputs/Select/Select';
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import DefaultInputH from '../../inputs/DefaultInputH/DefaultInputH';
import MultiSelect from '../../FormElements/MultiSelect';
import { useSession } from 'next-auth/react';
import {drivePermis, status, documentsOptions, citizenshipOptions} from '@/src/config/constants'
import {DriveOption, DocumentEntry, Comment, Profession, Language} from "../interfaces/FormCandidate.interface"

const AddCandidateForm = ({ professions, setSidebarROpen, clearForm }: any) => {
  const { data: session } = useSession();
  const [phone, setPhone] = useState('');
  const { addNotification } = useNotifications();
  const [file, setFile] = useState<File | null>(null); // Состояние для выбранного файла
  const [comment, setComment] = useState<Comment>({
    authorId: '',
    author: '',
    text: '',
    date: new Date(),
  });  const [languesEntries, setLanguesEntries] = useState<Language[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<DriveOption[]>([]);
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>([]);
  const [professionEntries, setProfessionEntries] = useState<Profession[]>([]);

  const managerId = session?.managerId || '';


  const getDriveDataForSubmit = () => {
    // Извлекаем только значения
    return selectedDrive.map(item => item.value);
  };


  
  const handleCommentChange = (field: keyof Comment, value: string) => {
    setComment((prevComment) => ({
      ...prevComment,
      [field]: value, // обновляем только одно поле
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

  // Функция для удаления языка
  const removeLanguage = (index: number) => {
    const updatedLangues = languesEntries.filter((_, i) => i !== index);
    setLanguesEntries(updatedLangues);
  };


  // Функция для подготовки данных для отправки
  const getLanguagesDataForSubmit = () => {
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

  const handleFileChange = (index: number, e: any) => {
    const updatedDocuments = [...documentEntries];
    const file = e.target.files[0]; // Получаем файл

    if (file) {
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        file: file, // Добавляем файл в объект документа
      };
      setDocumentEntries(updatedDocuments);
    }
  };

  const handleDocumentChange = (index: number, field: string, value: string) => {
    const updatedDocuments = [...documentEntries];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value
    };
    setDocumentEntries(updatedDocuments);
  };

  const removeDocumentEntry = (index: number) => {
    const newEntries = documentEntries.filter((_, i) => i !== index);
    setDocumentEntries(newEntries);
  };

  const getDocumentsDataForSubmit = () => {
    return documentEntries.map(doc => ({
      docType: doc.docType || '', // Обязательно указываем значение, даже если оно пустое
      dateExp: doc.dateExp || '', // Добавляем пустую строку, если дата не указана
      dateOfIssue: doc.dateOfIssue || '', // Добавляем пустую строку для даты выдачи
      numberDoc: doc.numberDoc || '', // Указываем пустую строку для номера документа
      file: doc.file || null, // Если файл есть, добавляем его, если нет - null
    }));
  };



  const addProfessionEntry = () => {
    setProfessionEntries([...professionEntries, { name: 'Нет профессии', level: '',experience: '', category: '' }]);
  };

  const handleProfessionChange = (index: number, field: string, value: string) => {
    const updatedProfessions = [...professionEntries];
    updatedProfessions[index] = { ...updatedProfessions[index], [field]: value };
    setProfessionEntries(updatedProfessions); // Обновляем состояние
  };
  const getProfessionsDataForSubmit = () => {
    return professionEntries.map(prof => ({
      name: prof.name || '',  // Используем пустую строку, если нет значения
      level: prof.level || ''  // Если нет опыта, также используем пустую строку
    }));
  };



  const removeProfessionEntry = (index: number) => {
    const newEntries = professionEntries.filter((_, i) => i !== index);
    setProfessionEntries(newEntries);
  };

  // const generateId = () => uuidv4();
  // console.log(generateId)
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  // Функция для добавления нового телефона
  const addAdditionalPhone = () => {
    setAdditionalPhones([...additionalPhones, '']);
  };

  // Функция для изменения номера телефона
  const handleAdditionalPhoneChange = (index: number, value: string) => {
    const updatedPhones = [...additionalPhones];
    updatedPhones[index] = value;  // Обновляем телефон по индексу
    setAdditionalPhones(updatedPhones);
  };

  // Функция для удаления телефона
  const removeAdditionalPhone = (index: number) => {
    const updatedPhones = additionalPhones.filter((_, i) => i !== index);
    setAdditionalPhones(updatedPhones);
  };

  // Функция для подготовки данных телефонов для отправки
  const getAdditionalPhonesDataForSubmit = () => {
    // Возвращаем массив строк, не включающий пустые значения
    return additionalPhones.filter(phone => phone.trim() !== '');
  };


  const handlePhoneBlur = async () => {
    if (phone.trim() === '') {
      return;
    }

    try {
      // Отправка запроса на сервер для поиска по номеру телефона
      const response = await fetch('/api/checkPhone', {
        method: 'POST',  // Используем POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }), // Отправляем номер телефона в теле запроса
      });

      const data = await response.json();

      if (data.candidate) {
        addNotification({
          title: "Обновлено",
          content: `Кандидат с таким номером уже существует. Имя: ${data.candidate.name} Номер: ${data.candidate.phone}`,
          type: "error", // Пример успешного уведомления
          id: uuidv4Original(), // Генерация уникального id
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
    const languesData = getLanguagesDataForSubmit();
    const commentData = {
      authorId: managerId,
      author: managerId,
      text: comment.text,
      date: comment.date.toISOString(), // Преобразуем дату в строку
    };
    // Создайте новый объект FormData только для текстовых данных и файлов
    const formData = new FormData(event.target);
  
    // Добавляем только те поля, которые отсутствуют в оригинальном formData
    formData.append('managerId', managerId);
    formData.append('drivePermis', JSON.stringify(driveData));
    formData.append('professions', JSON.stringify(professionsData));
    formData.append('documents', JSON.stringify(documentsData));
    formData.append('langue', JSON.stringify(languesData));
    formData.append('additionalPhones', JSON.stringify(additionalPhonesData));
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
    <div className="lg:max-w-4xl mx-auto p-6 text-black-2 dark:text-white">
      <h2 className="text-center text-white text-2xl font-semibold mb-6">Добавить нового кандидата</h2>
      <form onSubmit={handleSubmit}
        className="grid grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr_1fr] gap-4">

        {/* Личные данные */}
        <div className=" text-white">
          <h3 className="font-semibold text-lg mb-2 text-black-2 dark:text-white">Личные данные</h3>
          <DefaultInput id="name" label="ФИО" placeholder="Иван Иванов" />

          <div className='relative'>
            <DefaultInput id="phone" label="Телефон" type="text" placeholder="+373696855446"
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur} />
            <button type="button" className="absolute top-[27px] right-[5px] text-green-400 hover:text-green-700 transition duration-300 ease-in-out" onClick={addAdditionalPhone}><CirclePlus width={20} height={20} /></button>
          </div>

          {additionalPhones.map((phone, index) => (
            <div key={index} className="flex gap-2 relative">
              <DefaultInput
                label={`${index + 1} телефон`}
                id={`additionalPhone${index}`}
                name={`additionalPhone${index}`}
                type="phone"
                placeholder={phone}
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAdditionalPhoneChange(index, e.target.value)}
              />

              <button
                type="button"
                className="absolute top-[25px] right-[5px] btn-xs self-end pb-0.5 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                onClick={() => removeAdditionalPhone(index)}
              >
                <X />
              </button>
            </div>
          ))}

          <DefaultInput id="ageNum" label="Возраст" type="text" placeholder="33" />
          <Select label={'Статус первого диалога'} id="status" name="status" options={status} />

        </div>

        {/* Работа */}
        <div className=" flex flex-col gap-1 ">
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
            {professionEntries.map((prof, index) => (
              <div key={index} className='flex w-full  gap-1 pr-2'>
                <label htmlFor="profession">
                  <select className="text-sm  border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" 
                  value={prof.name || ''} onChange={e => handleProfessionChange(index, 'name', e.target.value || '')}>
                    <option>Нет профессии</option>
                    {professions.map((profession: { _id: React.Key; name: string }) => (
                      <option key={profession._id} value={profession.name}>{profession.name}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="level">
                  <select className="text-sm   border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" value={prof.level || ''} onChange={e => handleProfessionChange(index, 'level', e.target.value || '')}>
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
            <h3 className="my-3 text-md font-bold">Документы</h3>
            <button className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out" type="button" onClick={addDocumentEntry}>
              <CirclePlus />
            </button>
          </div>
          <div className='flex flex-col gap-2 w-full'>

            {documentEntries.map((doc, index) => (
              <><div className="relative flex gap-3">
                {/* Скрытый инпут */}
                <input
                  type="file"
                  className="hidden" // Скрываем стандартный инпут
                  id={`fileInput-${index}`}
                  onChange={(e) => handleFileChange(index, e)} />

                {/* Иконка, которая будет выполнять функцию инпута */}
                <label
                  htmlFor={`fileInput-${index}`}
                  className="cursor-pointer"
                  aria-label="Upload file"
                >
                  <FileUp className="text-2xl" />  {/* Вставьте вашу иконку */}
                </label>

                {/* Отображение имени файла, если он выбран */}
                {doc.file && <p className="mt-2 text-sm text-gray-500">{doc.file.name}</p>}
              </div>
                <div key={index} className=" flex ">
                  <p className="">{`${index + 1}.`}</p>&nbsp;
                  <label htmlFor="nameDocument" className="flex flex-col items-center gap-2 relative">
                    <div className='flex  justify-center items-center'>
                      <select className="text-sm  h-[25px] border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary"
                        value={doc.docType || ''} onChange={e => handleDocumentChange(index, 'docType', e.target.value || '')}>
                        <option value="Не указано">Не указано</option>
                        {documentsOptions.map(({value, label}) =>  <option key={value} value={value}>{label}</option>)}
                      </select>
                      <DefaultInputH placeholder='Номер документа' id='nunberDoc' label='#:' type="text" defaultValue={doc.numberDoc} onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'numberDoc', e.target.value)} />
                    </div>
                    <div className='flex justify-center items-center gap-3'>
                      <DefaultInput id='dateOfIssue' label='Выдан' type="date" defaultValue={doc.dateOfIssue} onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'dateOfIssue', e.target.value)} />
                      <DefaultInput id='documDate' label='До' type="date" defaultValue={doc.dateExp} onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'dateExp', e.target.value)} />
                    </div>

                    <button className="absolute right-2 top-8 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out self-end flex"
                      type="button" onClick={() => removeDocumentEntry(index)}><X /></button>
                  </label>
                </div></>
            ))}
          </div>
          <p>Комментарий</p>
          <textarea               
          value={comment.text || ''} 
          onChange={(e) => handleCommentChange( 'text', e.target.value || '')}   
          id="comment" name="comment"
            rows={6}
            placeholder="Оставьте свой комментарий"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>

        </div>

        {/* Дополнительно */}
        <div >
          <h3 className="font-semibold text-lg mb-2">Дополнительно</h3>
          <Select label={'Гражданство'} id="citizenship" name="citizenship" placeholder='Выберите гражданство' options={citizenshipOptions} />
          <DefaultInput id='leaving' label='Готов выехать' type="date" />
          <DefaultInput label="Местоположение" id='locations' name='locations' />
          <MultiSelect label='Водительское удостоверение' options={drivePermis} placeholder="Категории В/У" className="w-full my-1 text-sm" onChange={(selected: string[]) => setSelectedDrive(selected.map(value => ({ label: value, value })))} id='drivePermis' />
          <DefaultInput id='cardNumber' label='Номер счёта' type="text" />
          <div className='flex justify-between items-center m-2'>
            <h3 className="my-3 text-md font-bold">Языки</h3>
            <button className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out" type="button" onClick={addLangue}>
              <CirclePlus />
            </button>
          </div>

          {/* Отображение списка языков */}
          <div className='flex flex-col gap-2 w-full'>
            {languesEntries.map((lang, index) => (
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
                    onClick={() => removeLanguage(index)}
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

export default AddCandidateForm;

