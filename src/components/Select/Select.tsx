import { useProfessionContext } from "@/src/context/ProfessionContext";
import { expiriences } from "@/src/config/constants";
import { Label } from "@/components/ui/label";

export const ProfessionSelect = ({ onProfessionChange, professionId, professionsVal }: any) => {
  console.log("PV", professionsVal.name)
  const { professions } = useProfessionContext();
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;  // Получаем выбранное имя профессии
    if (typeof onProfessionChange === "function") {
      // Передаем имя и id профессии в родительский компонент
      onProfessionChange(selectedName, professionId);  
    } else {
      console.error("onProfessionChange не является функцией");
    }
  };
    return (
        <div>
           <div className="flex flex-col space-y-1.5">
              <label htmlFor="profession" >
              <Label>Профессия</Label>
                  <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                    id="profession" name="profession" 
                    onChange={handleSelectChange}
                  >
                    <option value={''}>Без профессии</option>
                    {professions.map((profession: any) => (
            <option key={profession.name} value={profession.name}>
              {profession.name}
            </option>
          ))}                    
                  </select>
                </label>
            </div> 
        </div>
    )
}

export const ExpirienceSelect = ({ onProfessionChange, professionId }: any) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;  
    if (typeof onProfessionChange === "function") {
      // Передаем имя и id профессии в родительский компонент
      onProfessionChange(selected, professionId);  
    } else {
      console.error("onProfessionChange не является функцией");
    }
  };  
  return (
      <div>
      <div className="flex flex-col space-y-1.5">
         <label htmlFor="expirience" >
             <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
               id="expirience" name="expirience"
               onChange={handleSelectChange}
             >
               <option  value={''}>Без опыта</option>
               {expiriences.map((expiriences: any) => (
       <option key={expiriences.value} value={expiriences.value}>
         {expiriences.value}
       </option>
     ))}                    
             </select>
           </label>
       </div> 
   </div>
    )
}
