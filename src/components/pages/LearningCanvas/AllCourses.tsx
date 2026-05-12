import { Box, OutlinedInput, Skeleton, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetUserPurchasedCourseQuery } from "../../../services/courseApi";
import type { CanvasCourseStatus } from "../../../types/learningCanvas";
import { useDebounce } from "../../../utils/useDebounce";
import { EmptyList } from "../../molecules/EmptyList";
import TablePagination from "../../molecules/Pagination";
import TabController from "../../molecules/TabController";
import MyCourseCard from "../../organism/Cards/CourseCard/MyCourseCard";
import PageHeader from "../../organism/PageHeader";

const STATUS_TABS: { value: CanvasCourseStatus; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

// CourseProps.course_completion_status uses "ongoing" where the canvas
// taxonomy uses "in_progress" — bridge the two here.
function matchesStatus(
    courseStatus: "completed" | "ongoing" | "not_started",
    canvasStatus: CanvasCourseStatus,
) {
    if (canvasStatus === "all") return true;
    if (canvasStatus === "in_progress") return courseStatus === "ongoing";
    return courseStatus === canvasStatus;
}

export default function LearningCanvasAllCourses() {
    const { t } = useTranslation();
    const theme = useTheme();
    const [statusTab, setStatusTab] = useState<CanvasCourseStatus>("all");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 12 });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = useGetUserPurchasedCourseQuery({
        ...qp,
        search: debouncedSearch,
    });

    const courses = data?.data?.data ?? [];
    const pagination = data?.data?.pagination ?? null;

    const filteredCourses = useMemo(
        () => courses.filter((c) => matchesStatus(c.course_completion_status, statusTab)),
        [courses, statusTab],
    );

    return (
        <div className="flex flex-col justify-between h-full">
            <PageHeader
                breadcrumb={[{ title: t("messages.learning_canvas", { defaultValue: "Learning Canvas" }) }]}
            />
            <Box className="h-full overflow-auto">
                <div className="mb-4 lg:mb-6 flex justify-between items-center gap-3 flex-wrap">
                    <TabController
                        options={STATUS_TABS}
                        currentActive={statusTab}
                        setActiveTab={(value) => {
                            setQp((prev) => ({ ...prev, pageIndex: 1 }));
                            setStatusTab(value);
                        }}
                    />
                    <OutlinedInput
                        name="search"
                        placeholder="Search Course"
                        size="small"
                        value={search}
                        onChange={(e) => {
                            setQp((prev) => ({ ...prev, pageIndex: 1 }));
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                {!isLoading && !filteredCourses.length ? (
                    <EmptyList
                        title="No Courses to Learn Yet!"
                        description={
                            statusTab === "all"
                                ? "Enroll in a course to start learning."
                                : "No courses match this status. Try a different tab."
                        }
                    />
                ) : (
                    <div className="flex flex-col gap-4 lg:gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 pb-4">
                        {isLoading
                            ? Array.from({ length: qp.pageSize }).map((_, index) => (
                                <Box
                                    className="course__card rounded-md overflow-hidden relative h-full flex flex-col"
                                    sx={{ border: `1px solid ${theme.palette.textField.border}` }}
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
                                            <div className="grid grid-cols-2 gap-2">
                                                <Skeleton height={38} />
                                                <Skeleton height={38} />
                                            </div>
                                        </div>
                                    </Box>
                                </Box>
                            ))
                            : filteredCourses.map((course) => (
                                <div className="col-span-1" key={course.id}>
                                    <MyCourseCard course={course} />
                                </div>
                            ))}
                    </div>
                )}
            </Box>

            {pagination && pagination.total_pages > 1 ? (
                <TablePagination qp={qp} setQp={setQp} totalPages={pagination.total_pages} />
            ) : null}
        </div>
    );
}
