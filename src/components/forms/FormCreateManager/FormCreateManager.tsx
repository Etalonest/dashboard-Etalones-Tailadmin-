'use client';
import { useState } from "react";
import DefaultInput from "@/src/components/inputs/DefaultInput/DefaultInput";
import Select from "@/src/components/inputs/Select/Select";

const options = [
    { value: "admin", label: "Права администратора" },
    { value: "manager", label: "Права менеджера" },
];

const FormCreateManager = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Хэндлер для отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            name,
            email,
            phone,
            role,
            image,
        };

        try {
            const response = await fetch('/api/manager', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }

            setName('');
            setEmail('');
            setPhone('');
            setRole('');
            setImage(null);
            setLoading(false);
            alert('Менеджер успешно добавлен!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message); // Обработка ошибки
            } else {
                setError("Произошла ошибка при добавлении менеджера");
            }
            setLoading(false);
        }
    };

    // Хэндлер для изменения изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Проверяем на null
        if (file) {
            setImage(file); // Передаем файл
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-5">
        <div>
            <DefaultInput 
                label="Имя менеджера" 
                id="managerName" 
                type="text" 
                placeholder="Имя менеджера" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
            />
            <DefaultInput 
                label="Email менеджера" 
                id="managerEmail" 
                type="email" 
                placeholder="Email менеджера" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
            <DefaultInput 
                label="Телефон менеджера" 
                id="managerPhone" 
                type="tel" 
                placeholder="Телефон менеджера" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
            />
        </div>
        <div className="flex flex-col justify-between">
        <Select 
            label="Права менеджера" 
            id="managerRole" 
            options={options} 
            value={role}
            onChange={(e) => setRole(e.target.value)} 
        />
        
       
        <button 
            type="submit" 
            className=" inline-flex text-sm items-center justify-center rounded-full bg-primary px-5 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-5"
            disabled={loading}
        >
            {loading ? 'Загружается...' : 'Добавить менеджера'}
        </button>
        </div>
    </form>
    );
};

export default FormCreateManager;