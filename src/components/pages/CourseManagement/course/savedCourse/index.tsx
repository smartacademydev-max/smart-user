import { Box, Skeleton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../../routes/PATH";
import { useGetAllBookmarkedCourseQuery } from "../../../../../services/courseApi";
import { EmptyList } from "../../../../molecules/EmptyList";
import TablePagination from "../../../../molecules/Pagination";
import CourseCard from "../../../../organism/Cards/CourseCard/CourseCard";
import PageHeader from "../../../../organism/PageHeader";

export default function SavedCourse() {
    const { t } = useTranslation();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 8,
    });
    // const [search, setSearch] = useState("");
    const { data, isLoading } = useGetAllBookmarkedCourseQuery({
        ...qp,
    });

    const courses = data?.data?.data || [];
    const pagination = data?.data?.pagination || null;

    return (
        <>
            <PageHeader
                breadcrumb={[{
                    title: t("menus.savedCourse")
                }]}
            />
            {/* <Box className="flex flex-col justify-between gap-4 mb-4 lg:mb-8">
                <TableFilter categoryLayout={true} search={search} setSearch={(newVal) => setSearch(newVal)} />
            </Box> */}
            {/* LOADING */}
            <Box className="h-full overflow-auto">
                {isLoading ? (
                    <div className="flex flex-col gap-4 lg:gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5 pb-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Box
                                key={index}
                                className="course__card rounded-md overflow-hidden relative h-full flex flex-col"
                                sx={{ border: (theme) => `1px solid ${theme.palette.textField.border}` }}
                            >
                                <Skeleton variant="rectangular" height={110} width="100%" />

                                <Box className="course__content h-full p-3 bg-slate-50 flex flex-col gap-2 justify-between">
                                    <div>
                                        <Skeleton width={90} height={28} />
                                        <Skeleton width="85%" height={25} sx={{ mt: 1.5, mb: 2 }} />
                                        <Skeleton width="70%" height={18} />
                                        <Skeleton width="50%" height={18} />
                                    </div>

                                    <div>
                                        <Skeleton height={1} width="100%" sx={{ mb: 2 }} />
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
                        ))}
                    </div>
                ) : courses.length ? (
                    <>
                        <div className="flex flex-col gap-4 lg:gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5 pb-4">
                            {courses.map((course) => (
                                <div key={course.id} className="col-span-1">
                                    <CourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <EmptyList
                        title="No Course Found"
                        description="You have not saved any courses yet."
                        cta={{
                            label: "Explore Course",
                            url: PATH.COURSE_MANAGEMENT.COURSES.ROOT
                        }}
                    />
                )}
            </Box>
            {pagination && pagination.total_pages > 1 && (
                <TablePagination
                    qp={qp}
                    setQp={setQp}
                    totalPages={pagination.total_pages}
                />
            )}
        </>
    )
}
