'use client';
import { useEffect, useState } from "react";
import DefaultInput from "@/src/components/inputs/DefaultInput/DefaultInput";
import Select from "@/src/components/inputs/Select/Select";



const FormCreateManager = () => {
    // Состояния формы
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState<any>('');
    const [roles, setRoles] = useState<any[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/role');
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Ошибка при получении ролей:', error);
            }
        };

        fetchRoles();
    }, []);
    // Хэндлер для отправки формы
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Очистить ошибку перед новой отправкой

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
    const formatRolesForSelect = roles.map((role) => ({
        value: role._id, 
        label: role.name, // и name, измените это под структуру данных API
    }));
    return (
        <form onSubmit={handleSubmit} className="flex gap-5 z-[999]">
            <div>
                <DefaultInput
                    label="Имя менеджера"
                    id="managerName"
                    type="text"
                    placeholder="Имя менеджера"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <DefaultInput
                    label="Email менеджера"
                    id="managerEmail"
                    type="email"
                    placeholder="Email менеджера"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <DefaultInput
                    label="Телефон менеджера"
                    id="managerPhone"
                    type="tel"
                    placeholder="Телефон менеджера"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                />
            </div>
            <div className="flex flex-col justify-between">
                <Select
                    label="Права менеджера"
                    id="managerRole"
                    options={formatRolesForSelect}
                    value={role._id}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)} // Уточнили тип события для <select>
                />

                <label htmlFor="image" className="block mt-4">Изображение</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                />
                
                <button
                    type="submit"
                    className="inline-flex text-sm items-center justify-center rounded-full bg-primary px-5 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-5 mt-4"
                    disabled={loading}
                >
                    {loading ? 'Загружается...' : 'Добавить менеджера'}
                </button>
            </div>

            {/* Отображение ошибки, если она произошла */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
    );
};

export default FormCreateManager;
