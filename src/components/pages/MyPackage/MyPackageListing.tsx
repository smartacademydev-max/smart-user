import { Box, OutlinedInput, Skeleton, useTheme } from "@mui/material";
import { useState } from "react";
import type { PackageType } from "../../../types/course";
import { useGetUserPurchasedCourseQuery } from "../../../services/courseApi";
import { useDebounce } from "../../../utils/useDebounce";
import { EmptyList } from "../../molecules/EmptyList";
import TablePagination from "../../molecules/Pagination";
import TabController from "../../molecules/TabController";
import MyCourseCard from "../../organism/Cards/CourseCard/MyCourseCard";

const EMPTY_MESSAGES: Record<PackageType, { title: string; description: string }> = {
    course: { title: "No Course Purchased Yet!", description: "You are not enrolled in any course yet." },
    notes: { title: "No Notes Purchased Yet!", description: "You have not purchased any notes package yet." },
    video: { title: "No Videos Purchased Yet!", description: "You have not purchased any video package yet." },
    audio: { title: "No Audios Purchased Yet!", description: "You have not purchased any audio package yet." },
    test: { title: "No Tests Purchased Yet!", description: "You have not purchased any test package yet." },
    live_class: { title: "No Live Classes Purchased Yet!", description: "You have not purchased any live class package yet." },
};

interface Props {
    type: PackageType;
}

export default function MyPackageListing({ type }: Props) {
    const [activeTab, setActiveTab] = useState<"trial" | "purchased" | "free">("purchased");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 8 });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const theme = useTheme();

    const { data, isLoading } = useGetUserPurchasedCourseQuery({
        ...qp,
        type: activeTab,
        search: debouncedSearch,
        package_type: type,
    });

    const courses = data?.data?.data || [];
    const pagination = data?.data?.pagination || null;
    const emptyCopy = EMPTY_MESSAGES[type];

    return (
        <div className="flex flex-col justify-between h-full">
            <Box className="h-full overflow-auto">
                <div className="mb-4 lg:mb-6 flex justify-between items-center">
                    <TabController
                        options={[
                            { value: "purchased", label: "Purchased" },
                            { value: "trial", label: "Free Trial" },
                            { value: "free", label: "Free" },
                        ]}
                        currentActive={activeTab}
                        setActiveTab={(value) => {
                            setQp({ ...qp, pageIndex: 1 });
                            setActiveTab(value as any);
                        }}
                    />
                    <OutlinedInput
                        name="search"
                        placeholder="Search"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {!isLoading && !courses.length ? (
                    <EmptyList title={emptyCopy.title} description={emptyCopy.description} />
                ) : (
                    <div className="flex flex-col gap-4 lg:gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 pb-4">
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, index) => (
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
                                    <Skeleton
                                        variant="rectangular"
                                        width={60}
                                        height={22}
                                        sx={{ position: "absolute", top: 8, right: 8, borderRadius: 1 }}
                                    />
                                </Box>
                            ))
                            : courses.map((course) => (
                                <div className="col-span-1" key={course.id}>
                                    <MyCourseCard course={course} />
                                </div>
                            ))}
                    </div>
                )}
            </Box>
            {pagination && pagination?.total_pages > 1 ? (
                <TablePagination qp={qp} setQp={setQp} totalPages={pagination?.total_pages || 0} />
            ) : (
                ""
            )}
        </div>
    );
}
