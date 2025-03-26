// import React, { useRef, useEffect } from "react";

// interface Props {
//   children: React.ReactNode;
//   exceptionRef?: React.RefObject<HTMLElement>;
//   onClick: () => void;
//   className?: string;
// }

// const ClickOutside: React.FC<Props> = ({
//   children,
//   exceptionRef,
//   onClick,
//   className,
// }) => {
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickListener = (event: MouseEvent) => {
//       let clickedInside: null | boolean = false;
//       if (exceptionRef) {
//         clickedInside =
//           (wrapperRef.current &&
//             wrapperRef.current.contains(event.target as Node)) ||
//           (exceptionRef.current && exceptionRef.current === event.target) ||
//           (exceptionRef.current &&
//             exceptionRef.current.contains(event.target as Node));
//       } else {
//         clickedInside =
//           wrapperRef.current &&
//           wrapperRef.current.contains(event.target as Node);
//       }

//       if (!clickedInside) onClick();
//     };

//     document.addEventListener("mousedown", handleClickListener);

//     return () => {
//       document.removeEventListener("mousedown", handleClickListener);
//     };
//   }, [exceptionRef, onClick]);

//   return (
//     <div ref={wrapperRef} className={`${className || ""}`}>
//       {children}
//     </div>
//   );
// };

// export default ClickOutside;
import React, { useRef, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  exceptionRef?: React.RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

const ClickOutside: React.FC<Props> = ({
  children,
  exceptionRef,
  onClick,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let clickedInside = false;

      // Проверка, был ли клик внутри исключаемого элемента
      if (exceptionRef && exceptionRef.current) {
        // Клик внутри самого исключаемого элемента или его дочерних элементов
        clickedInside = exceptionRef.current.contains(target);
      }

      // Также проверяем, был ли клик внутри сайдбара
      if (wrapperRef.current && wrapperRef.current.contains(target)) {
        clickedInside = true;
      }

      // Если клик был не внутри ни одного из этих элементов, вызываем onClick
      if (!clickedInside) {
        onClick();
      }
    };

    // Добавляем слушатель событий для кликов
    document.addEventListener("mousedown", handleClickListener);

    return () => {
      // Удаляем слушатель при размонтировании компонента
      document.removeEventListener("mousedown", handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={`${className || ""}`}>
      {children}
    </div>
  );
};

export default ClickOutside;
