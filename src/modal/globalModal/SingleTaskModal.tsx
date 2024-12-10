'use client';
import { FaArrowDown } from "react-icons/fa";
import NotificationContext from "@/app/context/NotificationContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import TextInput from "../../inputs/TextInput/TextInput";
import { useSession } from "next-auth/react";

export default function SingleTaskModal({ candidate, onClose }) {
  const { data: session } = useSession();
  const router = useRouter();
  const addNotification = useContext(NotificationContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Получаем данные формы
    const formData = new FormData(event.target);
    const candidateId = candidate._id; // Убедитесь, что candidate определен
    const title = formData.get('title');
    const dateOfCompletion = formData.get('dateOfCompletion');

    const body = {
      candidateId,
      title,
      dateOfCompletion,
      email: session?.user.email // Получаем email менеджера из сессии
    };

    try {
      const response = await fetch(`/api/task`, { // Используем /api/task для создания задачи
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.ok) {
        addNotification({
          title: "Обновлено",
          content: "Задача успешно записана",
          type: "success",
          id: ""
        });
        onClose();
        router.refresh(); // Обновляем страницу
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="h-full w-full">
      <div>Имя: {candidate.name}</div>
      <div className="h-max">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 justify-center items-center">
          <p>Опишите поставленную задачу</p>
          <textarea
            className="textarea textarea-accent w-full"
            id="title"
            name="title"
            placeholder="Комментарий"
          />
          <TextInput
            id='dateOfCompletion'
            title='Дата выполнения'
            type="date"
            placeholder='Дата выполнения'
          />
          <button className="btn btn-primary w-full max-w-xs">
            Поставить задачу
          </button>
        </form>
      </div>

      <div tabIndex={0} className="collapse bg-base-200">
        <h3 className="collapse-title text-xl font-medium flex items-center justify-between">
          Существующие задачи<span><FaArrowDown /></span>
        </h3>
        <ul className="overflow-y-auto collapse-content">
          {candidate.tasks && candidate.tasks.length > 0 ? (
            candidate.tasks.map((task, index) => (
              <li key={index}>
                <div className='badge badge-accent'>
                  <span>Создана: {new Date(task.createdAt).toLocaleString().slice(0, 10)}</span>
                </div> - {task.text}
                <p><span className='font-semibold'>Комментарий менеджера: </span>{task.title}</p>
                <div className='badge badge-accent'>
                  <span>Выполнить до: {new Date(task.dateOfCompletion).toLocaleString().slice(0, 10)}</span>
                </div>
              </li>
            ))
          ) : (
            <li>No tasks available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
