// components/ActionDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Candidate } from "@/src/types/candidate";
import { Button } from "@/components/ui/button";

interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "delete" | "interview";
  candidate: Candidate | null;
}

const ActionDialog: React.FC<ActionDialogProps> = ({ isOpen, onClose, onConfirm, actionType, candidate }) => {
  const [comment, setComment] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[800px] p-4">
        <DialogHeader>
          <DialogTitle>
            {actionType === "delete" ? "Вы уверены?" : "Перевести на собеседование"}
          </DialogTitle>
          <DialogDescription className="w-2/3 text-start p-5">
            {actionType === "delete"
              ? "Это действие нельзя будет отменить. Вы уверены, что хотите удалить этого кандидата?"
              : "Выберите вакансию для кандидата и добавьте комментарий."
            }
          </DialogDescription>
        </DialogHeader>
        {actionType === "interview" && (
          <div className="mb-4">
            <select className="w-full mb-4">
              <option value="">Выберите вакансию</option>
              {/* Здесь можно вставить список вакансий */}
            </select>
            <textarea
              className="w-full h-24 p-2 border"
              placeholder="Комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          <Button type="submit" className="bg-red-500 text-white" onClick={onConfirm}>
            {actionType === "delete" ? "Подтвердить" : "Отправить на собеседование"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
