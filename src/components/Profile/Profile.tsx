'use client'
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useManager } from '@/src/context/ManagerContext';
import SidebarRight from "../SidebarRight";
import { useState } from "react";
import { Camera, Pencil } from "lucide-react";
import { TabsAdmin } from "./tabs/TabsAdmin";

const ProfileComponent = () => {
  const { manager } = useManager();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formType, setFormType] = useState<"addCandidate" | "editCandidate" | "viewCandidate" | "createManager" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: manager?.name ?? "Имя менеджера",
    phone: manager?.phone ?? "Телефон менеджера",
  });

  const handleClickName = () => {
    setIsEditingName(true);
  };

  // Функция для обработки клика по телефону (начало редактирования)
  const handleClickPhone = () => {
    setIsEditingPhone(true);
  };
  const handleBlur = async (field: any) => {
    const updatedValue = formData[field];

    const formDataToSend = new FormData();
    formDataToSend.append(field, updatedValue); // Добавляем данные в formData

    // Если добавлен файл, то добавляем его тоже
    if (file) {
      formDataToSend.append('file', file);
    }

    try {
      const response = await fetch(`/api/profile/${manager?._id}`, {
        method: 'PUT',
        body: formDataToSend, // Отправляем formData
      });
      if (!response.ok) {
        throw new Error('Не удалось обновить профиль');
      }

      const result = await response.json();
      if (result.success) {
        alert('Профиль успешно обновлен!');
        setIsEditingName(false);
        setIsEditingPhone(false);
      } else {
        alert('Не удалось обновить профиль');
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      alert('Не удалось обновить профиль');
    }
  };


  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Обновляем состояние с файлом


      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch(`/api/profile/${manager?._id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const result = await response.json();
        if (result.success) {

          alert('Профиль успешно обновлен!');
        } else {
          alert('Не удалось обновить профиль');
        }
      } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        alert('Не удалось обновить профиль');
      }
    }
  };


  const toggleSidebar = (type: "addCandidate" | "editCandidate" | "viewCandidate" | "createManager") => {
    setFormType(type);
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <><div className="mx-auto max-w-242.5">
      <SidebarRight
        sidebarROpen={sidebarOpen}
        setSidebarROpen={setSidebarOpen}
        formType={formType}
      />
      <Breadcrumb pageName="Profile" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={"/images/cover/cover-01.png"}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }} />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <form >
              <label
                htmlFor="header"
                className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
              >
                <input
                  type="file"
                  name="header"
                  id="header"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <span>
                  <Camera size="20" />
                </span>
                <span>Редактировать</span>
              </label>
            </form>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              {manager?.image && <Image
                src={`data:${manager.image.contentType};base64,${Buffer.from(manager.image.data).toString('base64')}`}
                width={160}
                height={160}
                style={{
                  borderRadius: "50%",
                  width: "100%",
                  height: "100%",
                }}
                alt={manager?.image?.name ?? "Имя менеджера"} />}
              <label
                htmlFor="file"
                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <Camera size="20" />

                <input
                  type="file"
                  name="file"
                  id="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {isEditingName ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className="border border-gray-300 p-2 rounded-md text-xl"
                />
              ) : (
                <span onClick={handleClickName} className="cursor-pointer">
                  {formData.name}
                </span>
              )}

            </h3>
            <div className="flex items-center justify-center">
              <p className="font-medium">
                {isEditingPhone ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onBlur={() => handleBlur('phone')}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                ) : (
                  formData.phone
                )}
              </p>
              <button
                onClick={handleClickPhone}
                className="ml-2 text-gray-500"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>            
            </div>
        </div>
      </div>
        <TabsAdmin />
    </div>
    </>
  );
};

export default ProfileComponent;