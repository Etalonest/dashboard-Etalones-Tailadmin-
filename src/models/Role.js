// role.js
import { Schema, model, models } from "mongoose";

const RoleSchema = new Schema({
  name: {
    type: String,
    enum: ["admin", "manager", "user", "moderator", "guest"], // Можем ограничить список возможных ролей
  },
  description: {
    type: String,
    required: false, // Описание роли (опционально)
  },
});

const Role = models?.Role || model("Role", RoleSchema);

export default Role;
