import { Schema, model, models } from "mongoose";
import {Candidate} from './Candidate';
import {Partner} from './Partner';
import {Manager} from './Manager';
import {Stage} from './Stage';
import {Vacancies} from './Vacancies';

const TaskSchema = new Schema({
  appointed: {
    type: Schema.Types.ObjectId,
    ref: 'Manager', 
  },
  taskName: {
    type: String, // Название задачи (например, "Анкетирование", "Подбор вакансии")
  },
  description: {
    type: String, // Описание задачи
  },
  status: {
    type: String, 
  },
  stage: {
    type: Schema.Types.ObjectId,
    ref: 'Stage', // Связь с этапом, на котором находится задача
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate', // Связь с кандидатом
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Manager', // Кто отвечает за выполнение задачи
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'Partner', // Связь с партнером
  },
  dueDate: {
    type: Date, // Дата, к которой нужно выполнить задачу
  }, 
  isViewed: {
    type: Boolean,
    default: false,
  },
  vacancy:{
    type: Schema.Types.ObjectId,
    ref: 'Vacancies',
  }
}, { timestamps: true });

const Task = models?.Task || model("Task", TaskSchema);
export default Task;