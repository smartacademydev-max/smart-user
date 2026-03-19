"use client";

import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

interface MakuraDatePickerProps {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
    includeTime?: boolean;
    format?: string;
    minDate?: Dayjs | null;
    error?: boolean;
    defaultTime?: { hour: number; minute: number };
}

function ArrowDownIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.6 7.45801L11.1667 12.8913C10.525 13.533 9.47499 13.533 8.83333 12.8913L3.39999 7.45801"
                stroke="#9CA3B0"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function MakuraDatePicker({
    value,
    onChange,
    required = false,
    fullWidth = true,
    placeholder = "Select date",
    includeTime = false,
    format,
    minDate,
    error = false,
    defaultTime,
}: MakuraDatePickerProps) {
    const [open, setOpen] = useState(false);
    const displayFormat = format || (includeTime ? "YYYY/MM/DD hh:mm A" : "YYYY/MM/DD");

    useEffect(() => {
        if (includeTime && !value) {
            const defaultDate = defaultTime
                ? dayjs().hour(defaultTime.hour).minute(defaultTime.minute).second(0)
                : dayjs();
            onChange(defaultDate);
        }
    }, [includeTime, value, onChange, defaultTime]);

    const handleChange = (newValue: Dayjs | null) => {
        onChange(newValue);
    };

    const CustomTextField = (params: any) => {
        return (
            <div style={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
                <TextField
                    {...params}
                    required={required}
                    fullWidth={fullWidth}
                    error={error}
                    onClick={() => setOpen(true)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            fontSize: "14px",
                            cursor: "pointer",
                            "& fieldset": {
                                borderColor: error ? "#d32f2f" : "#E5E7EB",
                            },
                            "&:hover fieldset": {
                                borderColor: error ? "#d32f2f" : "#1D82F5",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: error ? "#d32f2f" : "#1D82F5",
                            },
                        },
                        "& .MuiOutlinedInput-input": {
                            cursor: "pointer",
                            color: value ? "inherit" : "transparent",
                        },
                    }}
                />
                {!value && (
                    <div
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9CA3B0",
                            fontSize: "14px",
                            pointerEvents: "none",
                        }}
                    >
                        {placeholder}
                    </div>
                )}
            </div>
        );
    };

    const commonProps = {
        value,
        onChange: handleChange,
        format: displayFormat,
        minDate: minDate || undefined,
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
        enableAccessibleFieldDOMStructure: false,
        slots: {
            openPickerIcon: ArrowDownIcon,
            textField: CustomTextField,
        },
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {includeTime ? <DateTimePicker {...commonProps} /> : <DatePicker {...commonProps} />}
        </LocalizationProvider>
    );
}
