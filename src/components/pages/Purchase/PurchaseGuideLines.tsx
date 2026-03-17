import { Box, List, ListItem, Typography } from "@mui/material";

export default function PurchaseGuideLines() {
    return (
        <Box className="rounded-md p-4" sx={{
            borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`
        }}>
            <Typography variant="h6" color="primary" className="mb-3!">How Payment Work?</Typography>
            <List sx={{ listStyleType: "disc", pl: 2 }} className="space-y-2.5">
                <ListItem sx={{ display: "list-item" }}>
                    <Typography variant="subtitle2" fontWeight={400}>
                        Once you select a payment option and click “Pay Now,” you will be redirected to the secure payment page of our payment service provider.
                    </Typography>
                </ListItem>

                <ListItem sx={{ display: "list-item" }}>
                    <Typography variant="subtitle2" fontWeight={400}>
                        After the payment is completed successfully, you will automatically be redirected to your Purchased Items page where you can access your test.
                    </Typography>
                </ListItem>

                <ListItem sx={{ display: "list-item" }}>
                    <Typography variant="subtitle2" fontWeight={400}>
                        If you experience any issues during the payment process or have any questions, please feel free to contact our support team for assistance.
                    </Typography>
                </ListItem>
            </List>
        </Box>
    )
}
