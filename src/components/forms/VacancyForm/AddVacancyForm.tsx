'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useManager } from "@/src/context/ManagerContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CMultiSelect from "../../Multiselect/Multiselect";
import { documentsOptions, drivePermisData, languesData } from "@/src/config/constants";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/src/context/SessionContext";
import { useNotifications } from "@/src/context/NotificationContext";
import { v4 as uuidv4Original } from 'uuid';
import FirebaseImageUpload from "../../UploadForm/UploadForm";
import FirebaseImagesUpload from "../../firebase/FirebaseImagesUpload/FirebaseImagesUpload";
import { Partner } from "@/src/types/partner";
import { PartnerSelect } from "./PartnerSelect";
import { se } from "date-fns/locale";



const AddVacancyForm = ({ partners }: any) => {
  const { session } = useSession();
  const { manager } = useManager();  
  const managerId = session?.managerId || '';
  const { addNotification } = useNotifications();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<any | null>(null);
  const [vacancyTitle, setVacancyTitle] = useState<string>("");
  const [selectedDrive, setSelectedDrive] = useState(selectedProfession?.drivePermis || []);
  const [selectLangues, setSelectLangues] = useState(selectedProfession?.langue || []);
  const [selectDocs, setSelectDocs] = useState(selectedProfession?.pDocs || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagesCarousel, setImagesCarousel] = useState<string[]>([]);


  const [published, setPublished] = useState(false);
  const [urgently, setUrgently] = useState(false);
  const [last, setLast] = useState(false);

  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);  
  };
  const handleImagesUpload = (urls: string[]) => {
    setImagesCarousel(urls); // Обновляем состояние с новыми URL-ами изображений
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); 
      };
      reader.readAsDataURL(file); 
    }
  };
  useEffect(() => {
    if (selectedImage) {
      console.log("Selected Image", selectedImage);
    }
  }, [selectedImage]);
  
  useEffect(() => {
    if (imagesCarousel.length > 0) {
      console.log("Selected Image Carousel (base64)", imagesCarousel);
    }
  }, [imagesCarousel]);
  const handleDriveChange = (selected: string[]) => {
    setSelectedDrive(selected);
  };
  const handleLangueChange = (selectedLangues: string[]) => {
    setSelectLangues(selectedLangues);
  };
  
  const handleDocsChange = (selectedDocs: string[]) => {
    setSelectDocs(selectedDocs);
  };
  const handlePublishedChange = (checked: boolean) => {
    setPublished(checked);  // Обновляем состояние на true/false
  };
  
  const handleUrgentlyChange = (checked: boolean) => {
    setUrgently(checked);
  };
  
  const handleLastChange = (checked: boolean) => {
    setLast(checked);
  };
  const getDriveDataForSubmit = () => {
    return selectedDrive;
  };
  const getLanguesDataForSubmit = () => {
    return selectLangues;
  };
  const getDocsDataForSubmit = () => {
    return selectDocs;
  };

  const handleSelect = (partner: Partner, profession: any) => {
    console.log("Родительский компонент: полученные данные");
    console.log("Партнёр:", partner);
    console.log("Профессия:", profession);
    setSelectedPartner(partner);
    setSelectedProfession(profession);
    setVacancyTitle(profession.name); // Обновляем название вакансии
  };


  const handleSubmit = async (event: any) => {
    event.preventDefault();    
    const formData = new FormData(event.target);
    const driveData = getDriveDataForSubmit();
    const languesData = getLanguesDataForSubmit();
    const docsData = getDocsDataForSubmit();
    formData.append('imageUrl', selectedImage || '');
    formData.append('partnerId', selectedPartner?._id || '');
    formData.append('managerId', managerId);
    formData.append('homeImageUrl', JSON.stringify(imagesCarousel)); 
    formData.append('drivePermis', JSON.stringify(driveData));
    formData.append('langue', JSON.stringify(languesData));
    formData.append('documents', JSON.stringify(docsData));

    try {
      const response = await fetch('/api/vacancy', {
        method: 'POST',
        body: formData, // Используем formData, так как это содержит как текст, так и файлы
      });

      const data = await response.json();
      const message = data.message;
      console.log("Metadata", data);

      if (data.success) {
        addNotification({
          title: 'Успешно',
          content: message,
          type: 'success',
          id: uuidv4Original(),
        });
        
      }

      if (data.error) {
        addNotification({
          title: 'Ошибка',
          content: message,
          type: 'error',
          id: uuidv4Original(),
        });
      }
    } catch (error) {
      console.error('Ошибка при добавлении кандидата:', error);
    }
  };
  return (
    <Card className="m-4">
      <PartnerSelect partners={partners}  onSelect={handleSelect} />

      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-2">
            <div className="text-green-800 flex gap-2 justify-center items-center">
            <Label className="text-green-800">Вакансия на сайте</Label>
            <Checkbox 
            checked={published} 
            onCheckedChange={handlePublishedChange} 
            />
            </div>
            <div className="text-green-800 flex gap-2 justify-center items-center">
            <Label className="text-green-800">Нужен срочно человек</Label>
            <Checkbox checked={urgently} 
            onCheckedChange={handleUrgentlyChange} />
            </div>
            <div className="text-green-800 flex gap-2 justify-center items-center">
            <Label className="text-green-800">Одно место</Label>
            <Checkbox checked={last} 
            onCheckedChange={handleLastChange}  />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-3 gap-10" onSubmit={handleSubmit}>
          <div>
            <div>
              <Label>Название вакансии:</Label>
              <Input type="text" defaultValue={vacancyTitle|| ''} name="title"
                className="font-bold" />
            </div>
            <div>
              <Label>Место работы:</Label>
              <Input type="text" name="location" defaultValue={selectedProfession?.location} />
            </div>
            <div>
              <Label>Стоимость проживания:</Label>
              <Input type="text" name="homePrice" defaultValue={selectedProfession?.rentPrice} />
            </div>
            <div>
              <Label>Зарплата:</Label>
              <Input type="text" name="salary" defaultValue={selectedProfession?.salary} />
            </div>
            <div>
              <Label>Знание языков</Label>
                    <CMultiSelect options={languesData} placeholder={'Выберите языки'}
                      value={selectedProfession?.langue || []}
                      onChange={handleLangueChange} 
                      />
                  </div> 
             <div>
              <Label>Подходящие документы</Label>
                    <CMultiSelect options={documentsOptions} placeholder={'Выберите документы'}
                      value={selectedProfession?.pDocs || []}
                      onChange={handleDocsChange}
                      />
                  </div> 
                  <div>
              <Label>Водительское удостоверение</Label>
                    <CMultiSelect options={drivePermisData} placeholder={'Выбериите категории'}
                      value={selectedProfession?.drivePermis || []}
                      onChange={handleDriveChange} 
                      />
                  </div>
                  <div>
              <Label>Свободные места:</Label>
              <Input type="number" name="place" defaultValue={selectedProfession?.place} />
            </div>
            <div>
              <Label>Потенциал объекта:</Label>
              <Input type="text" name="workHours" defaultValue={selectedProfession?.workHours} />
            </div>
            <div>
              <Label>График:</Label>
              <Textarea  name="grafik" className="h-full"   />
            </div>
            <Button className="absolute top-4 right-4 bg-green-800 text-white">Добавить вакансию</Button>

          </div>
          <div className="flex flex-col gap-7 h-full">
          <div>
              <Label>Навыки:</Label>
              <Textarea  name="skills" defaultValue={selectedProfession?.skills} />
            </div>
          <div>
              <Label>Короткое описание вакансии:</Label>
              <Textarea  name="roof_type" defaultValue={selectedProfession?.roof_type}
                className="font-bold" />
            </div>
            <div className="h-full">
            <Label>Описание работы:</Label>
            <Textarea className="h-full" name="work_descr" defaultValue={selectedProfession?.workdescr} />
            </div>
            <div className="h-full">
            <Label>Описание условий проживания:</Label>
            <Textarea className="h-full" name="home_descr" defaultValue={selectedProfession?.workdescr} />
            </div>
          </div>
          <div className="flex justify-start flex-col gap-2">
           {/* <div className="grid grid-cols-3 gap-2">
            <Label>Главное изображение:</Label>
           <Input type="file" name="image" className="col-span-2" 
           onChange={handleImageChange}/>
           </div>
            <Image src={selectedImage || "/images/logo/logo-red.png"}
             alt={""} width={450} height={300} 
             className="rounded-md max-h-max" /> */}
                   <div className="flex justify-start flex-col gap-2">
            <FirebaseImageUpload onImageUpload={handleImageUpload} city={selectedProfession?.location} jobTitle={selectedProfession?.name} />
            {selectedImage && (
              <Image src={selectedImage} alt="Selected Image" width={450} height={300} className="rounded-md" />
            )}
          </div>

          <div className="flex justify-start flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
            {/* <Input type="file" multiple name="homeImages" className="col-span-2" 
            onChange={handleImageCarouselChange}/> */}
            <FirebaseImagesUpload
              city={selectedProfession?.location} 
              jobTitle={selectedProfession?.name}  
              onImagesUpload={handleImagesUpload}  
            />

            </div>
            <Carousel 
  orientation="horizontal"
  opts={{
    align: "center", 
    loop: true,     
  }}
  className="w-full"
>
  <CarouselContent className="-ml-4 flex">
  {imagesCarousel.map((image, index) => (
  <CarouselItem key={index} className="w-full flex-shrink-0 pl-4">
    <div className="p-1">
      <Image
        src={image}
        alt={`Image ${index + 1}`}
        width={350}
        height={200}
        className="rounded-md max-h-max mx-auto"
      />
    </div>
  </CarouselItem>
))}

  </CarouselContent>
  <CarouselPrevious type='button' className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
    &lt;
  </CarouselPrevious>
  <CarouselNext type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
    &gt;
  </CarouselNext>
</Carousel>

          </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="flex gap-2 items-center">
          <div className="flex flex-col gap-2">
            <span>Куратор </span>
            <div>
              <Link href={manager?.telegram || ''} className="font-semibold">
              {manager?.name}: <span>{manager?.phone}</span></Link>
              
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AddVacancyForm;
