import { useProfessionContext } from "@/src/context/ProfessionContext";
import { expiriences, statusCandidate, documents } from "@/src/config/constants";
import { Label } from "@/components/ui/label";

export const ProfessionSelect = ({ onProfessionChange, professionId, professionsVal }: any) => {
  const { professions } = useProfessionContext();
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;  
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
                    <option value={''}></option>
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

export const StatusSelect = ({ onStatusChange }: any) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;  
    if (typeof onStatusChange === "function") {
      // Передаем выбранный статус в родительский компонент
      onStatusChange(selectedStatus);  
    } else {
      console.error("onStatusChange не является функцией");
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="status">
          <Label>Статус</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            id="status" name="status" 
            onChange={handleSelectChange}
          >
            <option value={''}></option>
            {statusCandidate.map((status: any) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export const DocumentsSelect = ({ onDocumentChange }: any) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDocument = e.target.value;  
    if (typeof onDocumentChange === "function") {
      // Передаем выбранный документ в родительский компонент
      onDocumentChange(selectedDocument);  
    } else {
      console.error("onDocumentChange не является функцией");
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="document">
          <Label>Документ</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            id="document" name="document" 
            onChange={handleSelectChange}
          >
            <option value={''}>Выберите документ</option>
            {documents.map((document: any) => (
              <option key={document.value} value={document.value}>
                {document.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};