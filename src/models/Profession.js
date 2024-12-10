import { Schema, model, models } from "mongoose";

// Определяем схему профессии
const ProfessionSchema = new Schema({
  name: {
    type: String,
    unique: true, // Уникальность имени профессии
  },
  experience: { 
    type: String, 
  },
  category: {
    type: String,
  },
});

// Создаем модель с использованием схемы
const Profession = models?.Profession || model("Profession", ProfessionSchema);

export default Profession;
