// 'use client'

// interface DefaultInputProps {
//   label: string;
//   placeholder?: string;
//   type?: string;
//   id: string;
//   [x: string]: any; 
// }

// const DefaultInput: React.FC<DefaultInputProps> = ({
//   defaultValue,
//   label,
//   placeholder = "Введите значение",
//   type = "text",
//   id,
//   ...rest
// }) => {
//   return (
//     <div className="flex flex-col space-y-1">
//       <label className="block text-sm font-medium text-black dark:text-white">
//         {label}
//       </label>
//       <input
//         type={type}
//         id={id}
//         name={id}
//         placeholder={placeholder}
//         className="w-[250px] h-[20px] rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//         {...rest} // передаем дополнительные пропсы
//       />
//     </div>
//   );
// };

// export default DefaultInput;
'use client'

interface DefaultInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  id: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Функция для обработки изменений
  [x: string]: any;
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  value, 
  label,
  placeholder = "Введите значение",
  type = "text",
  id,
  onChange, 
  ...rest
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value} // Используем value для привязки состояния
        onChange={onChange} // Обработчик для изменения значения
        className="w-[250px] h-[20px] rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        {...rest}
      />
    </div>
  );
};

export default DefaultInput;
