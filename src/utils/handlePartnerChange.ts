// // handleChange.ts
// export const createHandleChange = (setter: React.Dispatch<React.SetStateAction<any>>) => {
//     return (e: React.ChangeEvent<HTMLInputElement>) => {
//       setter(e.target.value);
//     };
//   };
  // handleChange.ts
export const createHandleChange = (setter: React.Dispatch<React.SetStateAction<any>>) => {
  return (e: React.ChangeEvent<HTMLInputElement>, field?: string) => {
    // Если передано поле, обновляем только это поле в объекте
    if (field) {
      setter((prevState: any) => ({
        ...prevState, // сохраняем предыдущие значения
        [field]: e.target.value, // обновляем только нужное поле
      }));
    } else {
      setter(e.target.value); // если поле не передано, обновляем только значение
    }
  };
};
