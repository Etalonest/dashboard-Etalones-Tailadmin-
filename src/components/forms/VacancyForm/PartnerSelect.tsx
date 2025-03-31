// import * as React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState } from "react";
// import { Partner } from "@/src/types/partner";

// interface AddVacancyFormProps {
//   partners: Partner[]; // Массив партнёров
//   onSelect: (partner: Partner, profession: any) => void; // Колбэк для передачи выбранного партнёра и профессии
// }

// export function PartnerSelect({ partners, onSelect }: AddVacancyFormProps) {
//   const [selectedProfession, setSelectedProfession] = useState<any | null>(null); // Состояние для выбранной профессии
//   const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null); // Состояние для выбранного партнёра

//   // Обработчик изменения профессии и партнёра
//   const handleProfessionChange = (profession: any, partner: Partner) => {
//     setSelectedProfession(profession); // Обновляем выбранную профессию
//     setSelectedPartner(partner); // Обновляем партнёра
//     onSelect(partner, profession); // Передаем данные в родительский компонент
//   };

//   return (
//     <div>
//       <Select>
//         <SelectTrigger className="w-[280px]">
//           <SelectValue placeholder="Выберите партнёра и профессию" />
//         </SelectTrigger>
//         <SelectContent>
//           {partners?.map((partner, index) => (
//             <SelectGroup key={index}>
//               <SelectLabel>{partner.name}</SelectLabel>
//               {partner.professions?.map((profession, idx) => (
//                 <SelectItem
//                   key={idx}
//                   value={profession.name}
//                   onSelect={() => handleProfessionChange(profession, partner)} // Передаем данные о профессии и партнёре
//                 >
//                   {profession.name}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           ))}
//         </SelectContent>
//       </Select>


     
//     </div>
//   );
// }
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Partner } from "@/src/types/partner";

interface AddVacancyFormProps {
  partners: Partner[];
  onSelect: (partner: Partner, profession: any) => void;
}

export function PartnerSelect({ partners, onSelect }: AddVacancyFormProps) {
  const [selectedProfession, setSelectedProfession] = useState<any | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleProfessionChange = (profession: any, partner: Partner) => {
    setSelectedProfession(profession);
    setSelectedPartner(partner);
    onSelect(partner, profession);
  };

  return (
    <div>
      <Select onValueChange={(value) => {
        const selected = partners.flatMap(p => p.professions.map(prof => ({ prof, partner: p })))
          .find(({ prof }) => prof._id === value);
        if (selected) handleProfessionChange(selected.prof, selected.partner);
      }}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Выберите партнёра и профессию" />
        </SelectTrigger>
        <SelectContent>
          {partners?.map((partner) => (
            <SelectGroup key={partner._id}>
              <SelectLabel>{partner.name}</SelectLabel>
              {partner.professions?.map((profession) => (
                <SelectItem key={profession._id} value={profession._id}>
                  {profession.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}