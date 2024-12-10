'use client'
import React from 'react';
import { useRouter } from "next/navigation";
import MultiSelect from '../FormElements/MultiSelect';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultInput from '../inputs/DefaultInput/DefaultInput';

const ModalAddCandidate = () => {
  return (
    <div className='mt-[100px] h-[30vw]'>
      <h1 className="text-xl font-semibold mb-6 ">Добавить кандидата</h1>

      {/* Грид для 3 колонок: Личные данные, Профессии и документы, Дополнительно */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  ">
        
        {/* Личные данные */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold mb-4">Личные данные</h2>
          <DefaultInput label="Фамилия" />
        
          <DefaultInput label="Дата рождения" />
          <DefaultInput label="Телефон" />
          <DefaultInput label="Email" />
          
        </div>

        {/* Профессии и документы */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-semibold mb-4">Профессии и документы</h2>
          <DefaultInput label="Профессия" />
          <DefaultInput label="Опыт работы" />
          <MultiSelect id="multiSelect" />
          <DefaultInput label="Серия паспорта" />
        </div>

        {/* Дополнительно */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-semibold mb-4">Дополнительно</h2>
          <DefaultInput label="Адрес" />
          <DefaultInput label="Гражданство" />
          <DefaultInput label="Семейное положение" />
          <DefaultInput label="Зарплатные ожидания" />
        </div>
      </div>
    </div>
  );
};

export default ModalAddCandidate;
