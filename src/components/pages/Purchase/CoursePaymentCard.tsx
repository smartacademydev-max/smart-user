import { Box, Button, Divider, Typography, useTheme } from "@mui/material";

interface Props {
    price: number;
    vat: number;
    total: number;
    isLoading?: boolean;
}

export default function CoursePaymentCard({ price, vat, total, isLoading }: Props) {
    const theme = useTheme();

    return (
        <Box
            sx={{ background: theme.palette.primary.light }}
            className="rounded-md py-6 px-8"
        >
            <Typography variant="body2" className="font-semibold mb-2!">
                Order Summary
            </Typography>

            <div className="flex flex-col gap-2 5">

                <div className="grid grid-cols-2">
                    <Typography variant="subtitle1" color="text.middle">Model Price:</Typography>
                    <Typography variant="subtitle1" color="text.dark" className="text-end font-medium">
                        NRs. {price.toLocaleString()}
                    </Typography>
                </div>

                <div className="grid grid-cols-2">
                    <Typography variant="subtitle1" color="text.middle">VAT:</Typography>
                    <Typography variant="subtitle1" color="text.dark" className="text-end font-medium">
                        + NRs. {vat.toLocaleString()}
                    </Typography>
                </div>

                <Divider sx={{ borderColor: theme.palette.text.light }} />

                <div className="grid grid-cols-2">
                    <Typography variant="subtitle1" color="text.middle">Total</Typography>
                    <Typography variant="subtitle1" color="text.dark" className="text-end font-medium">
                        NRs. {total.toLocaleString()}
                    </Typography>
                </div>
            </div>

            <Button
                className="primary__btn mt-2.5!"
                type="submit"
                variant="contained"
                fullWidth
            >
                {isLoading ? "Proceeding Payment" : "Pay Now"}
            </Button>
            {/* <Button
                className="primary__btn mt-2.5!"
                variant="contained"
                fullWidth
            >
                Generate QR
            </Button> */}
        </Box>
    );
}
