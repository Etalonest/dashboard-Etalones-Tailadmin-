'use client'
import React, { useState } from 'react';

const SendEmailForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Забыли пароль');
  const [text, setText] = useState('Ваш новый пароль: 123456');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        subject,
        text,
      }),
    });

    const data = await response.json();
    alert(data.message);  // Показать сообщение от сервера
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
      </div>
      <div>
        <label>Тема:</label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
        />
      </div>
      <div>
        <label>Текст письма:</label>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
      </div>
      <button type="submit">Отправить</button>
    </form>
  );
};

export default SendEmailForm;
