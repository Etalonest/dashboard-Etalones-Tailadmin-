import { Schema, model, models } from "mongoose";
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {Manager} from './Manager';
import {Task} from './Task';
import {Vacancies} from './Vacancies';
const StageSchema = new Schema({
  stage: {
    type: String, // Название этапа (например, stage-zero, stage-recruiter и т.д.)
  },
  vacancy: {
    type: Schema.Types.ObjectId,
    ref: 'Vacancies', // Вакансия, на которую кандидат претендует
  },
  status: {
    type: String, // Статус кандидата на текущем этапе (например, 'в процессе', 'завершено', 'отказ', 'ожидает')
  },
  comment: {
    type: String, // Дополнительные комментарии по этапу
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'Partner', // Партнер, с которым работает кандидат
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate', // Кандидат, проходящий через этап
  },
  responsible: {
    type: Schema.Types.ObjectId,
    ref: 'Manager', // Менеджер, ответственный за этап
  },
  startDate: {
    type: Date, // Дата начала этапа
  },
  endDate: {
    type: Date, // Дата окончания этапа (если применимо)
  },
  reasonForHalt: {
    type: String, // Причина остановки на этапе
  },
  isFinal: {
    type: Boolean, // Завершен ли процесс
    default: false,
  },
  uniqueCandidateVacancy: {
    type: Schema.Types.ObjectId,
    ref: 'Vacancies', // Уникальная связь, чтобы предотвратить повторные собеседования
  },
}, { timestamps: true });

const Stage = models?.Stage || model("Stage", StageSchema);
export default Stage;