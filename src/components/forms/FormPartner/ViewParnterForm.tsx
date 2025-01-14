import React from 'react';

interface Partner {
  name: string;
  phone: string;
  professions: { name: string }[];
  // добавьте другие поля, которые вам нужны
}

const ViewParnterForm = ({ partner }: { partner: Partner | null }) => {

  // Проверка на null
  if (!partner) {
    return <p>Нет данных о кандидате</p>;
  }

  return (
    <div>
        
      
      <h2>Просмотр кандидата</h2>
      <p><strong>Имя:</strong> {partner.name}</p>
      <p><strong>Телефон:</strong> {partner.phone}</p>
     
    </div>
  );
};

export default ViewParnterForm;
