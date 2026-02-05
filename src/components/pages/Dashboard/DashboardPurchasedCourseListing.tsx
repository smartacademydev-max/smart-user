import { Box, Button, Skeleton, Typography } from "@mui/material";
import { t } from "i18next";
import { Book, SearchNormal } from "iconsax-reactjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/PATH";
import { useGetUserPurchasedCourseQuery } from "../../../services/courseApi";
import MyCourseCard from "../../organism/Cards/CourseCard/MyCourseCard";
import InfoCard from "../../organism/Cards/InfoCard";


export default function DashboardPurchasedCourseListing() {
    const navigate = useNavigate();

    const exploreCoursesCards = [
        {
            title: "Browse Courses",
            description:
                "Discover new courses, explore different subjects, and find the perfect learning path for your goals.",
            icon: <SearchNormal />,
            cta: { url: PATH.COURSE_MANAGEMENT.COURSES.ROOT, label: "Browse Course" },
        },
        {
            title: "Saved Content",
            description:
                "Access your saved courses and continue learning from where you left off.",
            icon: <Book />,
            cta: { url: PATH.COURSE_MANAGEMENT.COURSES.SAVED_COURSES.ROOT, label: "View Saved" },
        },
    ];

    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 4,
    });

    const { data, isLoading } = useGetUserPurchasedCourseQuery({ ...qp });

    const courses = data?.data?.data || [];
    return (
        <div className="dashboard__purchased__course__lisitng">
            <div className="flex justify-between items-center gap-4 mb-4! mt-8!">
                <Typography variant="h4" fontWeight={600} >{t("messages.my_course")}</Typography>
                <Button variant="contained" onClick={() => navigate(PATH.COURSE_MANAGEMENT.COURSES.ROOT)}>{t("actions.view_all")}</Button>
            </div>

            <div className="flex flex-col gap-4 lg:gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 pb-4">
                {isLoading ? Array.from({ length: 4 }).map((_, index) => (
                    <Box
                        className="course__card rounded-md overflow-hidden relative h-full flex flex-col"
                        sx={{ border: (theme) => `1px solid ${theme.palette.textField.border}` }}
                        key={index.toString()}
                    >

                        <Skeleton variant="rectangular" height={110} width="100%" />

                        <Box className="course__content h-full p-3 bg-slate-50 flex flex-col gap-2 justify-between">
                            <div className="top__content">
                                <Skeleton width={90} height={28} />
                                <Skeleton width="85%" height={25} sx={{ mt: 1.5, mb: 2 }} />
                                <Skeleton width="70%" height={18} />
                                <Skeleton width="50%" height={18} />
                            </div>

                            <div className="footer__content mt-3">
                                <Skeleton height={1} width="100%" sx={{ mb: 2 }} />

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Skeleton height={38} />
                                    <Skeleton height={38} />
                                </div>
                            </div>
                        </Box>

                        <Skeleton
                            variant="rectangular"
                            width={60}
                            height={22}
                            sx={{ position: "absolute", top: 8, right: 8, borderRadius: 1 }}
                        />
                    </Box>
                )) :
                    courses.map((course) => (
                        <div className="col-span-1">
                            <MyCourseCard course={course} />
                        </div>
                    ))
                }

                {courses.length < 3 ? exploreCoursesCards.map((card, index) => (
                    <InfoCard
                        key={index}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                        cta={card.cta}
                    />
                )) : ""}
            </div>


        </div>
    )
}
