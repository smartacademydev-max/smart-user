import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { Clock, CloseCircle, Medal, Notepad2 } from "iconsax-reactjs";
import { useGetAllOmrInstructionsQuery, useGetOmrInstructionByIdQuery } from "../../../services/omrInstructionApi";
import type { TestProps } from "../../../types/question";
import { renderHtml } from "../../../utils/renderHtml";

interface OmrInstructionModalProps {
    open: boolean;
    onClose: () => void;
    test: TestProps;
}



export default function OmrInstructionModal({
    open,
    onClose,
    test,
}: OmrInstructionModalProps) {
    const { data: listData, isLoading: listLoading } = useGetAllOmrInstructionsQuery(
        { pageIndex: 1, pageSize: 1 },
        { skip: !open }
    );

    const firstId = listData?.data?.data?.[0]?.id;

    const { data, isLoading: detailLoading } = useGetOmrInstructionByIdQuery(
        { id: firstId! },
        { skip: !open || !firstId }
    );

    const isLoading = listLoading || detailLoading;
    const format = data?.data;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    px: 3,
                    pt: 2.5,
                    pb: 1,
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.5,
                            mb: 1,
                            borderRadius: 1.5,
                            background: (theme) => theme.palette.primary.light,
                        }}
                    >
                        <Typography
                            variant="caption"
                            fontWeight={500}
                            sx={{ color: (theme) => theme.palette.primary.main }}
                        >
                            {test?.selections?.mega_category?.[0] || "Bank"}
                        </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="text.dark">
                        {test.name}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={onClose} sx={{ mt: 0.5 }} color="error">
                    <CloseCircle size={22} variant="Bold" />
                </IconButton>
            </Box>

            {/* Stats row */}
            <Box sx={{ px: 3, pb: 1.5 }}>
                <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
                    <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.info.main }}>
                            <Notepad2 size={15} variant="Bold" />
                        </Box>
                        <strong>{test.total_questions}</strong>&nbsp;Total Questions
                    </Typography>
                    <Box sx={{ color: "divider" }}>|</Box>
                    <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.success.main }}>
                            <Clock variant="Bold" size={15} />
                        </Box>
                        <strong>{test.duration?.hours}</strong>&nbsp;Hrs&nbsp;:&nbsp;
                        <strong>{test.duration?.minutes}</strong>&nbsp;Mins
                    </Typography>
                    <Box sx={{ color: "divider" }}>|</Box>
                    <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.error.main }}>
                            <Medal variant="Bold" size={15} />
                        </Box>
                        <strong>{test.full_mark}</strong>&nbsp;Total Marks
                    </Typography>
                    <Box sx={{ color: "divider" }}>|</Box>
                    <Typography variant="caption" color="text.dark" className="flex items-center gap-1">
                        <Box sx={{ color: (theme) => theme.palette.warning.main }}>
                            <Medal variant="Bold" size={15} />
                        </Box>
                        <strong>{test.pass_mark}</strong>&nbsp;Pass Marks
                    </Typography>
                </Stack>
            </Box>

            <Divider />

            <DialogContent sx={{ px: 3, py: 2 }}>
                {isLoading ? (
                    <Box className="flex justify-center items-center py-10">
                        <CircularProgress size={36} />
                    </Box>
                ) : format ? (
                    <Stack gap={2.5} flexDirection={"column"}>
                        {/* Test instructions */}
                        <Box>
                            <Box className="flex gap-4">
                                <Box className="flex-1">
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                        sx={{ color: (theme) => theme.palette.primary.main, mb: 1 }}
                                    >
                                        Instruction to take a test
                                    </Typography>
                                    <div>
                                        {renderHtml(format.test_instructions)}
                                    </div>
                                </Box>
                                {format.qr_code_url && (
                                    <Box className="flex flex-col items-center gap-1 shrink-0">
                                        <Box
                                            component="img"
                                            src={format.qr_code_url}
                                            alt="QR Code"
                                            sx={{ width: 100, height: 100, objectFit: "contain" }}
                                        />
                                        {/* <Typography variant="caption" color="text.secondary" textAlign="center">
                                            Scan the QR code to<br />access the question
                                        </Typography> */}
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        <Divider />

                        {/* OMR sheet instructions */}
                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                sx={{ color: (theme) => theme.palette.primary.main, mb: 1 }}
                            >
                                Instruction how to answer using the OMR sheet.
                            </Typography>
                            <div>
                                {renderHtml(format.omr_sheet_instructions)}
                            </div>

                            {(format.wrong_method_image_url || format.correct_method_image_url) && (
                                <Box className="flex gap-6 mt-3">
                                    {format.wrong_method_image_url && (
                                        <Box className="flex flex-col items-start gap-1">
                                            <Typography variant="caption" fontWeight={600} color="text.dark">
                                                Wrong Method
                                            </Typography>
                                            <Box
                                                component="img"
                                                src={format.wrong_method_image_url}
                                                alt="Wrong method"
                                                sx={{ height: 40, objectFit: "contain" }}
                                            />
                                        </Box>
                                    )}
                                    {format.correct_method_image_url && (
                                        <Box className="flex flex-col items-start gap-1">
                                            <Typography variant="caption" fontWeight={600} color="text.dark">
                                                Correct Method
                                            </Typography>
                                            <Box
                                                component="img"
                                                src={format.correct_method_image_url}
                                                alt="Correct method"
                                                sx={{ height: 40, objectFit: "contain" }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>

                        <Divider />

                        {/* Post-test instructions */}
                        <Box>
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                sx={{ color: (theme) => theme.palette.primary.main, mb: 1 }}
                            >
                                Instruction on what to do after completing test.
                            </Typography>
                            <div>
                                {renderHtml(format.post_test_instructions)}
                            </div>
                        </Box>

                        {/* OMR Note */}
                        {format.omr_note && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 1.5,
                                    borderLeft: (theme) => `3px solid ${theme.palette.error.main}`,
                                    background: (theme) => theme.palette.error.light,
                                }}
                            >

                                {renderHtml(format.omr_note)}
                            </Box>
                        )}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No instructions available.
                    </Typography>
                )}
            </DialogContent>

            {/* Footer */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: 1,
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                }}
            >
                {test.download_format_url && (
                    <Button
                        variant="outlined"
                        color="primary"
                        component="a"
                        href={test.download_format_url}
                        download
                    >
                        Download OMR Sheet
                    </Button>
                )}
                <Button variant="contained" color="primary" onClick={onClose}>
                    Got it
                </Button>
            </Box>
        </Dialog>
    );
}
