import { Box, Typography, useTheme } from "@mui/material";
import type { PaymentOption } from "../../../types/purchase";

interface Props {
    options: PaymentOption[];
    selected: string;
    onSelect: (value: string) => void;
}

export default function PurchasePaymentOption({ options, selected, onSelect }: Props) {
    const theme = useTheme();

    return (
        <div className="payment__options__selection">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {options.map((option) => (
                    <div
                        key={option.id}
                        className="col-span-1 cursor-pointer"
                        onClick={() => onSelect(option.value)}
                    >
                        <Box
                            className="py-3 px-6 rounded-md"
                            sx={{
                                border: `1px solid ${selected === option.value
                                    ? theme.palette.primary.main
                                    : theme.palette.textField.border
                                    }`,
                                background:
                                    selected === option.value
                                        ? theme.palette.primary.light
                                        : "transparent",
                                transition: "0.2s",
                            }}
                        >
                            <img src={option.image} alt={option.label} className="mb-3" />
                            <Typography variant="subtitle2" fontWeight={400}>
                                {option.label}
                            </Typography>
                        </Box>
                    </div>
                ))}
            </div>
        </div>
    );
}
