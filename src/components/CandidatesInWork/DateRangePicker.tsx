import React, { useState } from "react";

interface DateRangePickerProps {
  onFilter: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = () => {
    // Вызываем родительский метод с выбранными датами
    onFilter(startDate, endDate);
  };

  return (
    <div>
      <input
        type="date"
        value={startDate ? startDate.toISOString().split("T")[0] : ""}
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
      <input
        type="date"
        value={endDate ? endDate.toISOString().split("T")[0] : ""}
        onChange={(e) => setEndDate(new Date(e.target.value))}
      />
      <button onClick={handleDateChange}>Показать кандидатов</button>
    </div>
  );
};

export default DateRangePicker;

