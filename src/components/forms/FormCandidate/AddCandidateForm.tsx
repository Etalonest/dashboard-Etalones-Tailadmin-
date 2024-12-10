'use client'
import React, { useContext, useState } from 'react';
import DefaultInput from '../../inputs/DefaultInput/DefaultInput';
import { CirclePlus,  X } from 'lucide-react';
import Select from '../../inputs/Select/Select';
import MultiSelect from '../../FormElements/MultiSelect';
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';


const status = [
    { value: 'Не обработан', label: 'Не обработан' },
    { value: 'Нет месседжеров', label: 'Нет месседжеров' },
    { value: 'Не подходят документы', label: 'Не подходят документы' },
    { value: 'Документы не готовы', label: 'Документы не готовы' },
    { value: 'Не подошла вакансия', label: 'Не подошла вакансия' },
    { value: 'Нашел другую работу', label: 'Нашел другую работу' },
    { value: 'Ждёт работу', label: 'Ждёт работу' },
    { value: 'На собеседовании', label: 'На собеседовании' },
    { value: 'На объекте', label: 'На объекте' },
    { value: 'В ЧС', label: 'В ЧС' },
  ];
  const documentsOptions = [
  
    { value: 'Виза', label: 'Виза' },
    { value: 'Песель', label: 'Песель' },
    { value: 'Паспорт', label: 'Паспорт' },
    { value: 'Паспорт ЕС', label: 'Паспорт ЕС' },
    { value: 'Паспорт Биометрия Украины', label: 'Паспорт Биометрия Украины' },
    { value: 'Параграф 24', label: 'Параграф 24' },
    { value: 'Карта побыту', label: 'Карта побыту' },
    { value: 'Геверба', label: 'Геверба' },
    { value: 'Карта сталого побыта', label: 'Карта сталого побыта' },
    { value: 'Приглашение', label: 'Приглашение' }
  ];
  const citizenshipOptions = [
    { value: 'Евросоюза', label: 'Евросоюза' },
    { value: 'Молдовы', label: 'Молдовы' },
    { value: 'Украины', label: 'Украины' },
    { value: 'Беларусь', label: 'Беларусь' },
    { value: 'Узбекистана', label: 'Узбекистана' },
    { value: 'Таджикистана', label: 'Таджикистана' },
    { value: 'Киргизии', label: 'Киргизии' },
    { value: 'Армении', label: 'Армении' },
    { value: 'Грузии', label: 'Грузии' },
    { value: 'Казахстан', label: 'Казахстан' },
    { value: 'Другое', label: 'Другое' }
  ];
  
  const drivePermisOptions = [
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'Код 95', label: 'Код 95' },
    { value: 'Разрешение на спецтехнику', label: 'Разрешение на спецтехнику' },
  ]

  const languesOptions = [
    { value: 'Немецкий', label: 'Немецкий' },
    { value: 'Английский', label: 'Английский' },
    { value: 'Польский', label: 'Польский' },
    { value: 'Турецкий', label: 'Турецкий' },
    { value: 'Французский', label: 'Французский' },
    { value: 'Итальянский', label: 'Итальянский' },
  ]
const AddCandidateForm = ({professions}: any) => {
  const [selectedDrive, setSelectedDrive] = useState<{ label: string; value: string }[]>([]);
  const [professionEntries, setProfessionEntries] = useState([{ name: '', experience: '' }]);
  
  const addProfessionEntry = () => {
    setProfessionEntries([...professionEntries, { name: 'Нет профессии', experience: '' }]);
  };

  const handleProfessionChange = (index: number, field: string, value: string) => {
    const newEntries = [...professionEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setProfessionEntries(newEntries);
  };

  const removeProfessionEntry = (index: number) => {
    const newEntries = professionEntries.filter((_, i) => i !== index);
    setProfessionEntries(newEntries);
  };
    const { addNotification } = useNotifications();
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const generateId = () => uuidv4();  
    console.log(generateId)
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
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
    
    
    const [additionalPhones, setAdditionalPhones] = useState<string[]>([]); // Массив для хранения телефонов
    const professionOptions = professions.map((profession: { name: any; _id: any; }) => ({
        label: profession.name,  // Название профессии
        value: profession._id,   // Используем _id как значение
      }));
    // Функция для добавления нового телефона
  const addAdditionalPhone = () => {
    setAdditionalPhones([...additionalPhones, ""]);
  };

  // Функция для изменения значения дополнительного телефона
  const handleAdditionalPhoneChange = (index: number, value: string) => {
    const phones = [...additionalPhones];
    phones[index] = value;
    setAdditionalPhones(phones);
  };

  // Функция для удаления телефона
  const removeAdditionalPhone = (index: number) => {
    const phones = additionalPhones.filter((_, i) => i !== index);
    setAdditionalPhones(phones);
  };
  
  const handleSubmit = async(event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData);
    
    const body = {
      name: formData.get('name') || '',
      phone: formData.get('phone') || '',
      ageNum: formData.get('ageNum') || '',
      status: formData.get('status') || '',
      professions: professionEntries.filter(profession => profession.name.trim() !== '' || profession.experience.trim() !== ''),
      nameDocument: formData.get('nameDocument'),
      drivePermis: selectedDrive.map(d => d.value).join(', '),
      citizenship: formData.get('citizenship'),
      leaving: formData.get('leaving'),
      langue: formData.get('langue'),
      locations: formData.get('locations'),
      cardNumber: formData.get('cardNumber'),
    };
    try {
      const response = await fetch('/api/addCandidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Ошибка при добавлении кандидата:', error);
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
          <DefaultInput id="name" label="ФИО" placeholder="Иван Иванов" />
          
          <div className='relative'>
          <DefaultInput id="phone" label="Телефон" type="text" placeholder="+373696855446"
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}/>
          <button type="button" className="absolute top-0 left-15 text-green-400 hover:text-green-700 transition duration-300 ease-in-out" onClick={addAdditionalPhone}><CirclePlus width={20} height={20} /></button>
          </div>
          
          {additionalPhones.map((phone, index) => (
            <div key={index} className="flex gap-2">
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
                className="btn-xs self-end pb-0.5 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
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
        <div className=" flex flex-col gap-1">
          {/* <h3 className="font-semibold text-white text-lg mb-2">Профессии / Документы</h3> */}
          <label htmlFor="professions">
                        <div className="flex justify-between items-start m-2">
                          <h3 className="font-bold text-xl text-black-2 dark:text-white">Профессии</h3>
                          <button
                            className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                            type="button"
                            onClick={addProfessionEntry}
                          >
                            <CirclePlus />
                          </button>
                        </div>
                        {professionEntries.map((prof, index) => (
                          <div key={index} className='flex w-full  gap-1 '>
                            <label htmlFor="profession">
                              <select className="text-sm  border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" value={prof.name || ''} onChange={e => handleProfessionChange(index, 'name', e.target.value || '')}>
                                <option>Нет профессии</option>
                                {professions.map((profession: { _id: React.Key ; name: string  }) => (
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
                              className="btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                              type="button" onClick={() => removeProfessionEntry(index)}><X /></button>
                          </div>
                        ))}
                      </label>
          <MultiSelect  id="profession" placeholder='Выберите профессии' label={'Профессия'} name="profession" options={professionOptions} />
          <MultiSelect  id="nameDocument" placeholder='Выберите документы в наличии' label={'Документы'} name="nameDocument" options={documentsOptions} />
          <MultiSelect onChange={(selected: string[]) => setSelectedDrive(selected.map(value => ({ label: value, value })))}
            id="drivePermis" placeholder='Выберите категории В/У' label={'Водительское удостоверение'} name="drivePermis" options={drivePermisOptions} />

        </div>

        {/* Дополнительно */}
        <div className="">
          <h3 className="font-semibold text-lg mb-2">Дополнительно</h3>
          <Select label={'Гражданство'} id="citizenship" name="citizenship" placeholder='Выберите гражданство' options={citizenshipOptions} />
          <DefaultInput id='leaving' label='Готов выехать' type="date"  />
          <MultiSelect id="langue" placeholder='Знание языков' label={'Знание языков'} name="langue" options={languesOptions} />
          <DefaultInput label="Местоположение" id='locations' name='locations' />

          <DefaultInput id='cardNumber' label='Номер счёта' type="text" />
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
function uuidv4(): string {
    throw new Error('Function not implemented.');
}

