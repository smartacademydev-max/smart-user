import { Box, Divider, Typography, useTheme } from '@mui/material';
import { Clock, DocumentText, TaskSquare } from 'iconsax-reactjs';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from '../../../routes/PATH';
import { setPurchase } from '../../../slice/purchaseSlice';
import { useAppDispatch } from '../../../store/hook';
import type { CurriculumTestProps, DurationProps } from '../../../types/course';

interface Props {
    test: CurriculumTestProps;
    havePurchased: boolean;
    courseId?: number | null;
}

function formatDuration(d: DurationProps | undefined | null): string {
    const hours = Number(d?.hours ?? 0);
    const minutes = Number(d?.minutes ?? 0);
    if (hours === 0 && minutes === 0) return "—";
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
}

export default function CurriculumTestCard({ test, havePurchased, courseId }: Props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id: routeCourseId } = useParams();
    const resolvedCourseId = courseId ?? Number(routeCourseId);

    const handleClick = () => {
        if (havePurchased) {
            navigate(
                PATH.COURSE_MANAGEMENT.COURSES.VIEW_TEST.ROOT({
                    courseId: Number(resolvedCourseId),
                    testId: test.id,
                })
            );
        } else {
            dispatch(setPurchase({ courseId: Number(resolvedCourseId), open: true }));
        }
    };

    return (
        <Box
            sx={{ border: `1px solid ${theme.palette.textField.border}` }}
            className="p-3 rounded-md flex items-center gap-3 cursor-pointer"
            onClick={handleClick}
        >
            <Box
                className="min-w-12.5 h-12.5 rounded-md flex items-center justify-center"
                sx={{ background: theme.palette.primary.light, color: theme.palette.primary.main }}
            >
                <TaskSquare size={24} variant="Bold" />
            </Box>

            <div className="content w-full min-w-0">
                <div className="flex justify-between items-center gap-2">
                    <Typography variant="subtitle2" fontWeight={500} className="truncate">
                        {test.name}
                    </Typography>
                    {test.test_type ? (
                        <Typography
                            variant="caption"
                            className="capitalize px-2 py-0.5 rounded-md! shrink-0"
                            sx={{
                                bgcolor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                            }}
                        >
                            {test.test_type}
                        </Typography>
                    ) : null}
                </div>

                <Divider className="my-1.5!" />

                <div className="flex items-center gap-3">
                    <Typography color="text.middle" className="text-[12px]! flex items-center gap-1">
                        <DocumentText size={12} />
                        {test.total_questions} Qs
                    </Typography>
                    <Typography color="text.middle" className="text-[12px]! flex items-center gap-1">
                        <Clock size={12} />
                        {formatDuration(test.duration)}
                    </Typography>
                </div>
            </div>
        </Box>
    );
}
