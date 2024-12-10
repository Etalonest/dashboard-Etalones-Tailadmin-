'use client'
import { FaArrowDown } from "react-icons/fa";
import NotificationContext from "@/app/context/NotificationContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";


export default function ModalComment({id, candidate, onClose }) {
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCommentText = formData.get('comment');
      
        const newComment = newCommentText ? {
          text: newCommentText,
          date: new Date()
        } : null;
      
        const body = {
          comment: newComment ? [...candidate.comment, newComment] : candidate.comment
        };
      
        try {
          // const res = await fetch(`https://www.candidat.store/api/candidates/${id}`, {
          const res = await fetch(`https://etalones-sb-mantine.vercel.app/api/candidates/${id}`, {
                  // const res = await fetch(`http://localhost:3000/api/candidates/${id}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(body),
          });
      
          if (!res.ok) {
            throw new Error("Failed to update Candidate");
          }
          if (res.ok) {
            addNotification({
              title: "Обновлено",
              content: "Комментарий успешно добавлен",
              type: "success",
              id: ""
            });
onClose()
router.refresh();
// router.push("/dashboard/candidates");
          }
       
        } catch (error) {
          addNotification({
            title: "Ошибка",
            content: "Кандидат не обновлен, чтото пошло не так",
            type: "error",
            id: ""
          });
          console.log(error);
        }
      };

      const addNotification = useContext(NotificationContext);

    return (      
        <div className="h-full w-full">
        <div>Имя: {candidate.name}</div>
        <div className="h-max">
            <form onSubmit={handleSubmit}>
            <p>Напишите свой комментарий</p>
            <textarea className="textarea textarea-accent w-full"
                id="comment" name="comment" placeholder="Комментарий" /> 
                <button  className="btn btn-primary w-full max-w-xs">
            Отправить комментарий
          </button>
                </form>   
        </div>
        
        <div tabIndex={0} className="collapse bg-base-200">
        <h3 className="collapse-title text-xl font-medium flex items-center justify-between">
          Существующие комментарии !<span><FaArrowDown /></span>
        </h3>
        <ul className=" overflow-y-auto collapse-content">
          {candidate?.comment?.map((c, index) => (
            <li key={index}><span className='badge badge-accent'>{new Date(c.date).toLocaleString().slice(0, 10)}</span> - {c.text}</li>
          ))}
        </ul>
      </div>
      </div>  
    );
  }