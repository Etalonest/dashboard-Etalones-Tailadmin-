'use client'

interface DefaultInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  id: string;
  [x: string]: any; // Для дополнительных свойств
}

const DefaultInputH: React.FC<DefaultInputProps> = ({
  label,
  placeholder = "Введите значение",
  type = "text",
  id,
  ...rest
}) => {
  return (
    <div className="flex justify-center items-center space-y-1">
      <label className="block text-sm font-mediumtext-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="w-[250px] h-[20px] rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        {...rest} // передаем дополнительные пропсы
      />
    </div>
  );
};

export default DefaultInputH;
