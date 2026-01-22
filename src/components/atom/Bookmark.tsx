import { IconButton, useTheme } from '@mui/material';
import { useBookmakrCourseMutation } from '../../services/courseApi';
import { showToast } from '../../slice/toastSlice';
import { useAppDispatch } from '../../store/hook';
import type { CourseProps } from '../../types/course';

export default function Bookmark({ course }: { course: CourseProps }) {
    const dispatch = useAppDispatch()
    const theme = useTheme();
    const [bookmark] = useBookmakrCourseMutation();
    const handleBookmark = async () => {
        try {
            const response = await bookmark({ id: Number(course.id) }).unwrap();
            dispatch(
                showToast({
                    message: response?.message || "Unable to add bookmark.",
                    severity: "success",
                })
            )
        }
        catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to add bookmark.",
                    severity: "error",
                })
            )
        }
    }
    return (
        <IconButton size='small' sx={{ p: 0 }} onClick={handleBookmark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={course?.is_bookmarked ? theme.palette.primary.main : "none"} xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21L12 17L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke={course?.is_bookmarked ? theme.palette.primary.main : "#111111"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </IconButton>
    )
}
