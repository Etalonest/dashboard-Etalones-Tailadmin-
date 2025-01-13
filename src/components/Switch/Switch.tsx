import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
// import { Label } from "@/components/Label";  

export const SwitcherOne = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch.Root
        id="private"
        checked={isChecked}  // Передаем состояние
        onCheckedChange={handleSwitchChange}  // Обработчик изменения
      >
        <Switch.Thumb />
      </Switch.Root>
      {/* <Label htmlFor="private">Доступен всем</Label> */}
    </div>
  );
};
