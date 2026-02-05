import { Box, Divider, Typography, useTheme } from "@mui/material";
import { Calendar } from "iconsax-reactjs";
import type { CourseProps } from "../../../types/course";
import { formatDateCustom } from "../../../utils/dateFormat";
import { renderHtml } from "../../../utils/renderHtml";
import MyProgress from "../../atom/MyProgress";
import BannerCourseTypeModule from "./BannerCourseTypeModule";


export default function CourseBanner({ data, havePurchased }: { data?: CourseProps; isLoading: boolean, havePurchased: boolean }) {
    const theme = useTheme();


    const course = data || null;

    const endDate = formatDateCustom(course?.course_expiry?.end_date || "", { shortMonth: true });
    const startDate = formatDateCustom(course?.course_expiry?.start_date || "", { shortMonth: true });
    const day = endDate.split(' ')[0];
    const monthAndYear = endDate.split(' ').slice(1).join(' ');
    return (
        <Box className="rounded-md lg:rounded-4xl p-6 lg:py-11.5  lg:px-16" sx={{
            background: `url(/banner-bg.svg) no-repeat center/cover, ${theme.palette.primary.main}`
        }}>
            <div className="flex flex-col lg:grid grid-cols-20 gap-6">
                <div className="lg:col-span-8 xl:col-span-4 hidden lg:block">
                    <Box className=" thumbnail aspect-264/210 rounded-2xl lg:flex items-center overflow-hidden" sx={{
                        background: theme.palette.primary.contrastText
                    }}>
                        <img src={course?.thumbnail_url || "/logo.svg"} alt="" className="w-full h-full object-cover" />
                    </Box>
                </div>

                <div className="lg:col-span-12 xl:col-span-10 ">
                    <div className="flex flex-col gap-3.5 ">
                        {course?.mega_categories?.length ? (
                            <div className="flex gap-2 flex-wrap">
                                {course?.mega_categories.slice(0, 2).map((category) => (
                                    <Typography variant="subtitle2" key={category} className="py-0.5 px-2 rounded-md max-w-fit" sx={{
                                        background: theme.palette.primary.contrastText,
                                        color: theme.palette.primary.main
                                    }}>{category}</Typography>
                                ))}
                            </div>
                        ) : ""}
                        <Typography variant="h4" color="white" fontWeight={500} >{course?.name}</Typography>
                        {course?.description ? <Box className="general__content__box" sx={{
                            color: theme.palette.primary.contrastText
                        }}>
                            {renderHtml(course?.description || "")}
                        </Box> : ""}
                        <ul className="features flex flex-col gap-2 md:flex-row lg:gap-8">
                            {course?.subjects ? <li className="flex items-center gap-2">
                                <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.08301 3.25L9.08301 14.9167" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M4.06713 0.987863C6.85146 1.518 8.51093 2.62693 9.08333 3.26357C9.65574 2.62693 11.3152 1.518 14.0995 0.987863C15.5101 0.719295 16.2154 0.58501 16.816 1.0997C17.4167 1.6144 17.4167 2.45019 17.4167 4.12176V10.1291C17.4167 11.6576 17.4167 12.4218 17.0312 12.8989C16.6457 13.376 15.797 13.5376 14.0995 13.8608C12.5864 14.1489 11.4055 14.6079 10.5507 15.0692C9.70968 15.5231 9.28916 15.75 9.08333 15.75C8.8775 15.75 8.45698 15.5231 7.61598 15.0692C6.7612 14.6079 5.58027 14.1489 4.06713 13.8608C2.36971 13.5376 1.521 13.376 1.1355 12.8989C0.75 12.4218 0.75 11.6576 0.75 10.1291V4.12176C0.75 2.45019 0.75 1.6144 1.35065 1.0997C1.95131 0.58501 2.65658 0.719295 4.06713 0.987863Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <Typography variant="body2" color="white">{course?.subjects} Subjects</Typography>
                            </li> : ""}
                            {course?.no_of_notes ? <li className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_10023_127925)">
                                        <path d="M10.7328 5.84697L14.7102 6.90671M9.88017 9.01097L11.8689 9.54084M9.97909 14.9719L10.7746 15.1838C13.0245 15.7833 14.1495 16.083 15.0358 15.5742C15.9221 15.0654 16.2235 13.9468 16.8264 11.7095L17.679 8.5455C18.2819 6.30821 18.5833 5.18957 18.0716 4.3083C17.5599 3.42703 16.4349 3.1273 14.185 2.52782L13.3895 2.31587C11.1395 1.71639 10.0145 1.41665 9.12826 1.92545C8.24199 2.43425 7.94056 3.5529 7.33768 5.79018L6.48508 8.95418C5.8822 11.1915 5.58076 12.3101 6.09245 13.1914C6.60413 14.0726 7.72912 14.3724 9.97909 14.9719Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M10.0013 17.4549L9.20768 17.671C6.96299 18.2823 5.84065 18.5879 4.95646 18.0691C4.07228 17.5503 3.77154 16.4097 3.17008 14.1286L2.31948 10.9025C1.71802 8.62135 1.41729 7.48076 1.92777 6.58221C2.36936 5.80493 3.33464 5.83323 4.58464 5.83314" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_10023_127925">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <Typography variant="body2" color="white">{course?.no_of_notes} Notes</Typography>
                            </li> : ""}
                            {course?.no_of_audios ? <li className="flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 13.5C9 15.1569 7.65685 16.5 6 16.5C4.34315 16.5 3 15.1569 3 13.5C3 11.8431 4.34315 10.5 6 10.5C7.65685 10.5 9 11.8431 9 13.5ZM9 13.5V1.5L14.25 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <Typography variant="body2" color="white">{course?.no_of_audios} Audios</Typography>
                            </li> : ""}
                            {course?.no_of_videos ? <li className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3346 6.66667L13.3346 10L18.3346 13.3333V6.66667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11.668 5H3.33464C2.41416 5 1.66797 5.74619 1.66797 6.66667V13.3333C1.66797 14.2538 2.41416 15 3.33464 15H11.668C12.5884 15 13.3346 14.2538 13.3346 13.3333V6.66667C13.3346 5.74619 12.5884 5 11.668 5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <Typography variant="body2" color="white">{course?.no_of_videos} Videos</Typography>
                            </li> : ""}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-20 xl:col-span-6 ">
                    {havePurchased ?
                        <Box className="rounded-md p-4 bg-[rgba(255,255,255,0.12)] flex flex-col gap-4 w-full" sx={{
                            color: theme.palette.primary.contrastText
                        }}>
                            <div className="top">
                                <Typography variant="body2">Progress</Typography>
                                <Divider color={theme.palette.primary.contrastText} />
                            </div>
                            {course?.course_type !== "free" ? <div className="middle">
                                <Typography variant="caption">Validity</Typography>
                                <div className="flex items-center gap-1.5">
                                    <Typography variant="h4">{day}</Typography>
                                    <div className="date flex flex-col items-start justify-end">
                                        <Calendar size={12} />
                                        <Typography variant="caption">{monthAndYear}</Typography>
                                    </div>
                                </div>
                            </div> : ""}
                            <div className="bottom">
                                <div className="flex justify-between items-center">
                                    <Typography variant="caption">Progress</Typography>
                                    <Typography variant="subtitle1" fontWeight={500}>{data?.progress}%</Typography>
                                </div>

                                <MyProgress progress={data?.progress || 0} />
                                {course?.course_type !== "free" ? <div className="flex justify-between items-center">
                                    <Typography variant="caption">{startDate.split(",")[0]}</Typography>
                                    <Typography variant="subtitle1" >-</Typography>
                                </div> : ""}
                            </div>
                        </Box> : <BannerCourseTypeModule
                            courseType={course?.course_type}
                            courseExpiry={course?.course_expiry}
                            courseSubscription={course?.subscriptions || []}
                            purchaseStatus={course?.user}
                            canTakeFreeTrial={course?.can_take_free_trial}
                        />}
                </div>
            </div>
        </Box>
    )
}
