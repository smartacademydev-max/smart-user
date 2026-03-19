import { Box, Button, Divider, Typography } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import type { CourseProps } from "../../../../types/course";
import Bookmark from "../../../atom/Bookmark";
import MyProgress from "../../../atom/MyProgress";
import CourseStatus from "./CourseStatus";

export default function MyCourseCard({ course }: { course: CourseProps }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const endDate = course?.ends_at || "";
    const startDate = course?.started_from || "";
    const day = endDate.split(',')[0].split(' ')[0];
    const monthAndYear = endDate.split(',')[0].split(' ').slice(1).join(' ');
    const expiredDay = course?.user?.free_trial_expires_at?.split(',')[0].split(' ')[0];
    const expiredMonthAndYear = course?.user?.free_trial_expires_at?.split(',')[0].split(' ').slice(1).join(' ');


    return (
        <Box className="my__course__card rounded-lg p-3 md:p-4 h-full flex flex-col justify-between" sx={{
            background: (theme) => theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.separator.dark}`
        }}>
            <div className="my__course__top">
                <div className="flex items-center justify-between mb-2">
                    <CourseStatus status={course.course_type} />
                    <Bookmark course={course} />
                </div>
                <Typography className="mb-1.5! font-medium" variant="h6">{course.name}</Typography>
                <div className="flex justify-start items-center gap-4">
                    {course?.mega_categories?.length ? <>
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
                                <path d="M7.16797 2.5L7.16797 11.8333" stroke="#9CA3B0" stroke-linecap="round" />
                                <path d="M3.15371 0.69029C5.38117 1.1144 6.70874 2.00154 7.16667 2.51086C7.62459 2.00154 8.95216 1.1144 11.1796 0.69029C12.3081 0.475436 12.8723 0.368008 13.3528 0.779762C13.8333 1.19152 13.8333 1.86015 13.8333 3.19741V8.00331C13.8333 9.22604 13.8333 9.83741 13.5249 10.2191C13.2165 10.6008 12.5376 10.7301 11.1796 10.9886C9.96911 11.2191 9.02437 11.5864 8.34055 11.9554C7.66775 12.3185 7.33133 12.5 7.16667 12.5C7.002 12.5 6.66559 12.3185 5.99279 11.9554C5.30896 11.5864 4.36422 11.2191 3.15371 10.9886C1.79577 10.7301 1.1168 10.6008 0.808399 10.2191C0.5 9.83741 0.5 9.22604 0.5 8.00331V3.19741C0.5 1.86015 0.5 1.19152 0.980522 0.779762C1.46104 0.368008 2.02526 0.475436 3.15371 0.69029Z" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {course.mega_categories && course.mega_categories.length ? (
                                <Typography variant="subtitle2" color="text.middle">{course.mega_categories[0]}</Typography>
                            ) : null}
                        </div>
                        <Divider orientation="vertical" className="h-4!" />
                    </> : ""
                    }
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
                            <path d="M7.16797 2.5L7.16797 11.8333" stroke="#9CA3B0" stroke-linecap="round" />
                            <path d="M3.15371 0.69029C5.38117 1.1144 6.70874 2.00154 7.16667 2.51086C7.62459 2.00154 8.95216 1.1144 11.1796 0.69029C12.3081 0.475436 12.8723 0.368008 13.3528 0.779762C13.8333 1.19152 13.8333 1.86015 13.8333 3.19741V8.00331C13.8333 9.22604 13.8333 9.83741 13.5249 10.2191C13.2165 10.6008 12.5376 10.7301 11.1796 10.9886C9.96911 11.2191 9.02437 11.5864 8.34055 11.9554C7.66775 12.3185 7.33133 12.5 7.16667 12.5C7.002 12.5 6.66559 12.3185 5.99279 11.9554C5.30896 11.5864 4.36422 11.2191 3.15371 10.9886C1.79577 10.7301 1.1168 10.6008 0.808399 10.2191C0.5 9.83741 0.5 9.22604 0.5 8.00331V3.19741C0.5 1.86015 0.5 1.19152 0.980522 0.779762C1.46104 0.368008 2.02526 0.475436 3.15371 0.69029Z" stroke="#9CA3B0" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {course.subjects ? (
                            <Typography variant="subtitle2" color="text.middle">{course.subjects} {t("messages.subjects")}</Typography>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="my__course__bottom">
                <Divider className="my-3!" />
                <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                    {course?.course_type !== "free" ? <div className="middle">
                        {!course?.user?.is_free_trial_valid && !course?.user?.has_purchased ? <Typography variant="caption" color="error">Expired on</Typography> : <Typography variant="caption">Expires</Typography>}
                        <div className="flex items-center gap-1.5">
                            <Typography variant="h4">{expiredDay || day}</Typography>
                            <div className="date flex flex-col items-start justify-end">
                                <Calendar size={12} />
                                <Typography variant="caption">{!course?.user?.is_free_trial_valid ? monthAndYear : expiredMonthAndYear}</Typography>
                            </div>
                        </div>
                    </div> : ""}
                    <div className={`${course?.course_type === "free" ? "col-span-2" : ""} bottom`}>
                        <div className="flex justify-between items-center">
                            <Typography variant="caption">Progress</Typography>
                            <Typography variant="subtitle1" fontWeight={500}>{course?.progress}%</Typography>
                        </div>

                        <MyProgress progress={course?.progress || 0} />
                        {course?.course_type !== "free" ? <div className="flex justify-between items-center">
                            <Typography variant="caption">{startDate.split(",")[0]}</Typography>
                            <Typography variant="subtitle1" >-</Typography>
                        </div> : ""}
                    </div>
                </div>
                <Divider className="mt-3! mb-5!" />
                <div className="flex justify-content-between items-center gap-4">
                    {!course?.user?.is_free_trial_valid && !course?.user?.has_purchased ?
                        <Button fullWidth color="primary" variant="contained" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.PURCHASE.ROOT(Number(course.id), "course"))}>
                            {t("messages.purchase_now")}
                        </Button>
                        : <>
                            <Button variant="contained" color="primary" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(Number(course.id)))}>
                                {t("messages.continue")}
                            </Button>
                            <Button variant="outlined" color="primary" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.VIEW_COURSE.ROOT(Number(course.id)))}>
                                {t("messages.browse_this_course")}
                            </Button>
                        </>}
                </div>
            </div>
        </Box>
    )
}
