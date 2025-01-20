import { useProfessionContext } from "@/src/context/ProfessionContext";
import { experiences } from "@/src/config/constants";
export const ProfessionSelect = () => {
  const { professions } = useProfessionContext();
    return (
        <div>
           <div className="flex flex-col space-y-1.5">
              <label htmlFor="profession" >
                  <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                    id="profession" name="profession"
                  >
                    <option disabled selected value={''}>Выберите профессию</option>
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

export const ExpirienceSelect = () => {
    return (
      <div>
      <div className="flex flex-col space-y-1.5">
         <label htmlFor="expirience" >
             <select className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
               id="expirience" name="expirience"
             >
               <option disabled selected value={''}>Без опыта</option>
               {experiences.map((experiences: any) => (
       <option key={experiences.value} value={experiences.value}>
         {experiences.value}
       </option>
     ))}                    
             </select>
           </label>
       </div> 
   </div>
    )
}
