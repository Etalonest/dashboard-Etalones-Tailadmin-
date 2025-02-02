import { Card } from "@/components/ui/card";

interface AddVacancyFormProps {
  profession: any;  // Получаем профессию
}

const AddVacancyForm = ({ profession }: AddVacancyFormProps) => {
  return (
    <Card className="m-4">
      <h3>Добавить вакансию для {profession?.name}</h3>
      <form>
        <div>
          <label>Название вакансии:</label>
          <input type="text" defaultValue={profession?.name} name="vacancyName" />
        </div>
        <div>
          <label>Зарплата:</label>
          <input type="text" name="salary" defaultValue={profession?.salary} />  {/* Пример использования данных профессии */}
        </div>
        <div>
          <label>Место работы:</label>
          <input type="text" name="location" defaultValue={profession?.location} />  {/* Используем местоположение профессии */}
        </div>
        <button type="submit">Добавить вакансию</button>
      </form>
    </Card>
  );
};

export default AddVacancyForm;
