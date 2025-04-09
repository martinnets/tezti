import { useEffect, useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, isValid, parse } from "date-fns";
import { DayPicker } from "react-day-picker";

type Props = {
  label?: string;
  onChange: (value?: Date) => void;
  value: string | undefined;
};

const DatePicker = ({ label, value, onChange }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const headerId = useId();

  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = useState(new Date());

  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Hold the input value in state
  const [inputValue, setInputValue] = useState("");

  // Hold the dialog visibility in state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to toggle the dialog visibility
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  // Hook to handle the body scroll behavior and focus trapping.
  useEffect(() => {
    const handleBodyScroll = (isOpen: boolean) => {
      document.body.style.overflow = isOpen ? "hidden" : "";
    };
    if (!dialogRef.current) return;
    if (isDialogOpen) {
      handleBodyScroll(true);
      dialogRef.current.showModal();
    } else {
      handleBodyScroll(false);
      dialogRef.current.close();
    }
    return () => {
      handleBodyScroll(false);
    };
  }, [isDialogOpen]);

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue("");
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
      setInputValue(format(date, "yyyy-MM-dd"));
    }
    onChange(date);
    dialogRef.current?.close();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value); // keep the input value in sync
  };

  const setDate = (value: string) => {
    setInputValue(value); // keep the input value in sync

    const parsedDate = parse(value, "yyyy-MM-dd", new Date());

    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      setMonth(parsedDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  return (
    <div>
      <Label className="mb-2 font-medium text-default-600">{label}</Label>
      <div className="relative">
        <Input
          style={{ fontSize: "inherit" }}
          type="text"
          readOnly={true}
          value={inputValue}
          placeholder={"yyyy-MM-dd"}
          onClick={toggleDialog}
          onChange={handleInputChange}
        />{" "}
        <button
          className="absolute bottom-2 right-2"
          style={{ fontSize: "inherit" }}
          onClick={toggleDialog}
          aria-controls="dialog"
          aria-haspopup="dialog"
          aria-expanded={isDialogOpen}
          aria-label="Open calendar to choose booking date">
          📆
        </button>
      </div>
      <dialog
        role="dialog"
        ref={dialogRef}
        id={dialogId}
        aria-modal
        aria-labelledby={headerId}
        onClose={() => setIsDialogOpen(false)}>
        <DayPicker
          month={month}
          onMonthChange={setMonth}
          mode="single"
          selected={selectedDate}
          onSelect={(e) => handleDayPickerSelect(e)}
          footer={
            selectedDate !== undefined &&
            `Selected: ${selectedDate.toDateString()}`
          }
        />
      </dialog>
    </div>
  );
};

export default DatePicker;
