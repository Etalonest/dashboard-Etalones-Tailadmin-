import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SuitableV from "@/src/components/SuitableV/SuitableV";

const calculateCompletionPercentage = (candidate: any) => {
  let filledFields = 0;
  let totalFields = 0;

  if (candidate?.name) filledFields++;
  totalFields++;

  if(candidate?.cardNumber) filledFields++;
  totalFields++;
  if (candidate?.phone) filledFields++;
  totalFields++;

  if (candidate?.ageNum) filledFields++;
  totalFields++;

  if (candidate?.citizenship) filledFields++;
  totalFields++;

  if (candidate?.drivePermis && candidate?.drivePermis.length > 0) filledFields++;
  totalFields++;

  if (candidate?.locations) filledFields++;
  totalFields++;

  if (candidate?.professions && candidate?.professions.length > 0) filledFields++;
  totalFields++;

  if (candidate?.statusWork && candidate?.statusWork.length > 0) filledFields++;
  totalFields++;

  if (candidate?.documents && candidate?.documents.length > 0) {
    const passport = candidate?.documents.find((doc: any) => doc.docType === "Паспорт ЕС");
    if (passport && passport.file) filledFields++;
  }
  totalFields++;

  if (candidate?.langue && candidate?.langue.length > 0) filledFields++;
  totalFields++;

  if (candidate?.documentsFile && candidate?.documentsFile.length > 0) filledFields++;
  totalFields++;

  // Возвращаем процент заполненности
  const completionPercentage = (filledFields / totalFields) * 100;

  return completionPercentage.toFixed(2); // Форматируем процент до 2 знаков
};

export const RecruiterStage = ({ candidate }: any) => {
  // Вычисляем процент заполненности
  const completionPercentage = calculateCompletionPercentage(candidate);

  return (
    <>
      <Card className="p-2">
        <CardHeader>
          <CardTitle>2. Подготовка для передачи куратору</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-2 p-2 pt-5">
          <div className="flex items-center space-x-2 w-full">
            <div className="flex gap-6">
              <span>*</span>
              <p>Собрано информации</p>
            </div>
            <div>
              {/* Показываем процент заполненности */}
              <Badge className="text-green-800 bg-slate-100">{completionPercentage}%</Badge>
              <button>
                <Badge className="bg-slate-200 hover:bg-slate-100 text-green-800 cursor-pointer">
                  CV
                </Badge>
              </button>
            </div>
          </div>
        </CardContent>
            <SuitableV selectedProfessions={candidate?.professions.map((prof: any) => prof.name)}/>
      </Card>
    </>
  );
};

export default RecruiterStage;
