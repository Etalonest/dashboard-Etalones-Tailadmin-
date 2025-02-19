// import { Checkbox } from "@/components/ui/checkbox"; // ваш компонент Checkbox

// type InvitationProps = {
//   isInvited: boolean;
//   onInvitedChange: (checked: boolean) => void; // Приняли только boolean

//   status: string;
//   setStatus: any;

//   photoDocs: string;
//   setPhotoDocs: React.Dispatch<React.SetStateAction<string>>;

//   paid: boolean;
//   setPaid: React.Dispatch<React.SetStateAction<boolean>>;

//   comments: { author: string; text: string }[];
//   setComments: React.Dispatch<React.SetStateAction<{ author: string; text: string }[]>>;
// };

// export default function Invitation({
//   isInvited,
//   onInvitedChange,
//   status,
//   setStatus,
//   photoDocs,
//   setPhotoDocs,
//   paid,
//   setPaid,
//   comments,
//   setComments,
// }: InvitationProps) {

//   const handleCheckedChange = (checked: boolean | "indeterminate") => {
//     if (checked === "indeterminate") {
//       onInvitedChange(false); // если "indeterminate", то просто считаем как false
//     } else {
//       onInvitedChange(checked); // иначе передаем как есть
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <div className="flex justify-start items-center gap-2 my-2">
//         <p className="font-bold text-red-500">Хочет заказать у нас приглашение</p>
//         <Checkbox 
//           checked={isInvited} 
//           onCheckedChange={handleCheckedChange} // Передаем обработчик с кастомной логикой
//         />
//       </div>

//       <div className="my-2">
//         <label className="block font-bold text-gray-700">Статус</label>
//         <input
//           type="text"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)} // Обновляем статус, передавая строку
//           placeholder="Введите статус"
//           className="border border-gray-300 p-2 rounded-md"
//         />
//       </div>

//       <div className="my-2">
//         <label className="block font-bold text-gray-700">URL фотографии</label>
//         <input
//           type="text"
//           value={photoDocs}
//           onChange={(e) => setPhotoDocs(e.target.value)} // Обновляем photoDocs, передавая строку
//           placeholder="Введите URL фотографии"
//           className="border border-gray-300 p-2 rounded-md"
//         />
//       </div>

//       <div className="my-2">
//         <label className="block font-bold text-gray-700">Комментарий</label>
//         {comments.map((comment, index) => (
//           <div key={index} className="mb-2">
//             <textarea
//               value={comment.text}
//               onChange={(e) => {
//                 const newComments = [...comments];
//                 newComments[index].text = e.target.value; // Обновляем текст комментария
//                 setComments(newComments); // Передаем обновленный массив комментариев
//               }}
//               placeholder="Текст комментария"
//               className="border border-gray-300 p-2 rounded-md w-full mt-2"
//             />
//           </div>
//         ))}
//       </div>

//       <div className="my-2">
//         <label className="block font-bold text-gray-700">Оплачено</label>
//         <Checkbox
//           checked={paid}
//           onCheckedChange={(checked) => {
//             if (checked === "indeterminate") {
//               setPaid(false); // если "indeterminate", то считаем как false
//             } else {
//               setPaid(checked); // иначе передаем как есть
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// }
import { Checkbox } from "@/components/ui/checkbox"; // ваш компонент Checkbox

type InvitationProps = {
  isInvited: boolean;
  onInvitedChange: (checked: boolean) => void;  // Приняли только boolean

  status: string;
  setStatus: (value: string) => void;

  photoDocs: string;
  setPhotoDocs: (value: string) => void;

  paid: boolean;
  setPaid: (checked: boolean) => void;

  comments: { author: string; text: string }[];
  setComments: (index: number, newText: string) => void;
};

export default function Invitation({
  isInvited, 
  onInvitedChange, 
  status, 
  setStatus, 
  photoDocs, 
  setPhotoDocs, 
  paid, 
  setPaid, 
  comments, 
  setComments,
}: InvitationProps) {

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") {
      onInvitedChange(false); // если "indeterminate", то считаем как false
    } else {
      onInvitedChange(checked); // иначе передаем как есть
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-start items-center gap-2 my-2">
        <p className="font-bold text-red-500">Хочет заказать у нас приглашение</p>
        <Checkbox 
          checked={isInvited} 
          onCheckedChange={handleCheckedChange} // Передаем обработчик с кастомной логикой
        />
      </div>

      <div className="my-2">
        <label className="block font-bold text-gray-700">Статус</label>
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)} // Обновляем статус
          placeholder="Введите статус"
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="my-2">
        <label className="block font-bold text-gray-700">URL фотографии</label>
        <input
          type="text"
          value={photoDocs}
          onChange={(e) => setPhotoDocs(e.target.value)} // Обновляем URL фотографии
          placeholder="Введите URL фотографии"
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="my-2">
        <label className="block font-bold text-gray-700">Комментарий</label>
        {comments.map((comment, index) => (
          <div key={index} className="mb-2">
            <textarea
              value={comment.text}
              onChange={(e) => setComments(index, e.target.value)} // Обновляем текст комментария
              placeholder="Текст комментария"
              className="border border-gray-300 p-2 rounded-md w-full mt-2"
            />
          </div>
        ))}
      </div>

      <div className="my-2">
        <label className="block font-bold text-gray-700">Оплачено</label>
        <Checkbox
          checked={paid}
          onCheckedChange={(checked) => {
            if (checked === "indeterminate") {
              setPaid(false); // если "indeterminate", то считаем как false
            } else {
              setPaid(checked); // передаем обновленное значение
            }
          }}
        />
      </div>
    </div>
  );
}
