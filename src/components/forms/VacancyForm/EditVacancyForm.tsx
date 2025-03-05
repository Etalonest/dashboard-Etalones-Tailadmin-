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
import { useSession } from "next-auth/react";
import { useNotifications } from "@/src/context/NotificationContext";
import { v4 as uuidv4Original } from 'uuid';
import FirebaseImageUpload from "../../UploadForm/UploadForm";
import FirebaseImagesUpload from "../../firebase/FirebaseImagesUpload/FirebaseImagesUpload";



const EditVacancyForm = ({ vacancy, onSubmitSuccess }: any) => {
  const vacancyH= vacancy?.vacancy;
  const { data: session } = useSession();
  const { manager } = useManager();
  const managerId = session?.managerId || '';
  const { addNotification } = useNotifications();
  const [drivePermis, setDrivePermis] = useState(vacancyH?.drivePermis || []);
  const [langues, setLangues] = useState(vacancyH?.langues || []);
  const [documents, setDocuments] = useState(vacancyH?.documents || []);
  const [selectedImage, setSelectedImage] = useState(vacancyH?.image || '');
  const [imagesCarousel, setImagesCarousel] = useState<string[]>([]);


  const [published, setPublished] = useState(vacancyH?.published || false);
  const [urgently, setUrgently] = useState(vacancyH?.urgently || false);
  const [last, setLast] = useState(vacancyH?.last || false);
  

  useEffect(() => {
    if (vacancyH) {
      setDrivePermis(vacancyH.drivePermis || []);
      setLangues(vacancyH.langues || []);
      setDocuments(vacancyH.documents || []);
      setSelectedImage(vacancyH.image || '');
      setImagesCarousel(vacancyH.images || []); 
    }
  }, [vacancyH]);
  useEffect(() => {
    if (vacancyH?.image) {
      setSelectedImage(`data:${vacancyH.image.contentType};base64,${Buffer.from(vacancyH.image.data).toString('base64')}`);
    }

    if (vacancyH?.homeImages?.length > 0) {
      const images = vacancyH.homeImages.map((image: any) => 
        `data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`);
      setImagesCarousel(images);
    }
  }, [vacancyH]);
  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);  // Set the URL of the uploaded image
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
  const handleImageCarouselChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file)); 
      setImagesCarousel((prevImages) => [...prevImages, ...newImages]); 
    }
  };
  const handleDriveChange = (selected: string[]) => {
    setDrivePermis(selected);
  };
  const handleLangueChange = (selected: string[]) => {
    setLangues(selected);
  };
  const handleDocumentsChange = (selected: string[]) => {
    setDocuments(selected);
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
    return drivePermis;
  };
  const getLanguesDataForSubmit = () => {
    return langues;
  };
  const getDocumentsDataForSubmit = () => {
    return documents;
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const driveData = getDriveDataForSubmit();
    const languesData = getLanguesDataForSubmit();
    const documentsData = getDocumentsDataForSubmit();
    const formData = new FormData(event.target);

    // Добавляем только те поля, которые отсутствуют в оригинальном formData
    formData.append('managerId', managerId);
    formData.append('drivePermis', JSON.stringify(driveData)); 
    formData.append('langue', JSON.stringify(languesData));
    formData.append('documents', JSON.stringify(documentsData));

    formData.append('published', JSON.stringify(published));
    formData.append('urgently', JSON.stringify(urgently));
    formData.append('last', JSON.stringify(last));

    try {
      const response = await fetch(`/api/vacancy/${vacancyH?._id}`, {
        method: 'PUT',
        body: formData, // Используем formData, так как это содержит как текст, так и файлы
      });

      const data = await response.json();
      const message = data.message;

      if (data.success) {
        addNotification({
          title: 'Успешно',
          content: message,
          type: 'success',
          id: uuidv4Original(),
        });
        onSubmitSuccess();
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
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Редактировать вакансию  {vacancyH?.title}</div>
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
              <Input type="text" defaultValue={vacancyH?.title} name="title"
                className="font-bold" />
            </div>
            <div>
              <Label>Место работы:</Label>
              <Input type="text" name="location" defaultValue={vacancyH?.location} />
            </div>
            <div>
              <Label>Стоимость проживания:</Label>
              <Input type="text" name="homePrice" defaultValue={vacancyH?.homePrice} />
            </div>
            <div>
              <Label>Зарплата:</Label>
              <Input type="text" name="salary" defaultValue={vacancyH?.salary} />
            </div>
            <div>
              <Label>Знание языков</Label>
                    <CMultiSelect options={languesData} placeholder={'Выберите языки'}
                      value={Array.isArray(langues) ? langues : [langues]}
                      onChange={handleLangueChange} 
                      />
                  </div> 
             <div></div>
              <div>
              <Label>Подходящие документы</Label>
                    <CMultiSelect options={documentsOptions} placeholder={'Выберите подходящие документы'} 
                   value={Array.isArray(documents) ? documents : [documents]}            
                    onChange={handleDocumentsChange}           
                      />
                  </div>                
            <div>
            <Label>Водительское удостоверение</Label>
            <CMultiSelect options={drivePermisData} 
            value={Array.isArray(drivePermis) ? drivePermis : [drivePermis]}            
            placeholder={'Выбериите категории'}
            onChange={handleDriveChange} />
            </div> 
            <div>
              <Label>Свободные места:</Label>
              <Input type="number" name="place" defaultValue={vacancyH?.place} />
            </div>
            <div>
              <Label>Потенциал объекта:</Label>
              <Input type="text" name="workHours" defaultValue={vacancyH?.workHours} />
            </div>
            <div>
              <Label>График:</Label>
              <Textarea  name="grafik" className="h-full"  defaultChecked={vacancyH?.grafik} />
            </div>
            <Button className="absolute top-4 right-4 bg-green-800 text-white">Сохранить изменения</Button>

          </div>
          <div className="flex flex-col gap-7 h-full">
          <div>
              <Label>Навыки:</Label>
              <Textarea  name="skills" defaultValue={vacancyH?.skills} />
            </div>
            <div>
              <Label>Короткое описание вакансии:</Label>
              <Textarea   name="roof_type" defaultValue={vacancyH?.roof_type}
                className="font-bold" />
            </div>
            <div className="h-full">
            <Label>Описание работы:</Label>
            <Textarea className="h-full" name="work_descr" defaultValue={vacancyH?.work_descr} />
            </div>
            <div className="h-full">
            <Label>Описание условий проживания:</Label>
            <Textarea className="h-full" name="home_descr" defaultValue={vacancyH?.home_descr} />
            </div>
          </div>
          <div className="flex justify-start flex-col gap-2">
           <div className="grid grid-cols-3 gap-2">
            <Label>Главное изображение:</Label>
           {/* <Input type="file" name="image" className="col-span-2" 
           onChange={handleImageChange}/> */}
           </div>
           <div className="flex justify-start flex-col gap-2">
            <FirebaseImageUpload onImageUpload={handleImageUpload} city={vacancyH?.location} jobTitle={vacancyH?.name} />
            {selectedImage ? (
    <Image
      src={selectedImage} 
      alt={vacancyH?.image?.name || "Uploaded file"} 
      width={400}
      height={400}
    />
  ) : vacancyH?.imageFB ? (
    <Image
      src={vacancyH?.imageFB || "/images/logo/logo-red.png"}
      alt={"Default image"} 
      width={400}
      height={400}
    />
  ) : (
    <Image
      src="/images/logo/logo-red.png"
      alt="Default image"
      width={400}
      height={400}
    />
  )}
          </div>    
          <div className="flex justify-start flex-col gap-2">
  <FirebaseImagesUpload
      city={vacancyH?.location} 
      jobTitle={vacancyH?.name}  
      onImagesUpload={handleImagesUpload}  
  />
  
  {/* Если есть новые картинки в imagesCarousel, отображаем их */}
  <Carousel 
    orientation="horizontal"
    opts={{
      align: "center", 
      loop: true,     
    }}
    className="w-full"
  >
    <CarouselContent className="-ml-4 flex">
      {imagesCarousel.length > 0 ? (
        // Если есть новые изображения в imagesCarousel, показываем их
        imagesCarousel.map((image: string, index: number) => (
          <CarouselItem key={index} className="flex-shrink-0 md:w-1/4 pl-4 sm:w-1/2">
            <div className="p-1">
              <Image
                src={image}
                alt={`New Image ${index + 1}`}
                width={350}
                height={200}
                className="rounded-md max-h-max mx-auto"
              />
            </div>
          </CarouselItem>
        ))
      ) : (
        // Если новых изображений нет, показываем старые изображения
        vacancyH?.homeImageFB?.map((image: string, index: number) => (
          <CarouselItem key={index} className="flex-shrink-0 md:w-1/4 pl-4 sm:w-1/2">
            <div className="p-1">
              <Image
                src={image}
                alt={`Old Image ${index + 1}`}
                width={350}
                height={200}
                className="rounded-md max-h-max mx-auto"
              />
            </div>
          </CarouselItem>
        ))
      )}
    </CarouselContent>
    <CarouselPrevious type="button" className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
      &lt;
    </CarouselPrevious>
    <CarouselNext type="button" className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
      &gt;
    </CarouselNext>
  </Carousel>
</div>
     
          {/* <div className="flex justify-start flex-col gap-2">
          <FirebaseImagesUpload
              city={vacancyH?.location} 
              jobTitle={vacancyH?.name}  
              onImagesUpload={handleImagesUpload}  
            />
           
            <Carousel 
  orientation="horizontal"
  opts={{
    align: "center", 
    loop: true,     
  }}
  className="w-full"
>
  <CarouselContent className="-ml-4 flex">
              {vacancyH?.homeImageFB?.map((image: string, index: number) => (
                  <CarouselItem key={index} className="flex-shrink-0 md:w-1/4 pl-4 sm:w-1/2">
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

          </div> */}
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

export default EditVacancyForm;
