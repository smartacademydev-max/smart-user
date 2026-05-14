import { ArrowLeft2 } from "iconsax-reactjs";
import { IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../../../routes/PATH";
import { useGetCourseMediaPlaylistQuery, useGetUserPurchasedCourseQuery } from "../../../../../services/courseApi";
import type { QueryParams } from "../../../../../types";
import CoursePlaylistListing from "../../../CourseManagement/course/singleCourse/coursePlaylistListing";

export default function AllNoteList() {
    const navigate = useNavigate();
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const courseId = courseIdParam ? Number(courseIdParam) : null;

    const [qp, setQp] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });

    const { data: myCourse } = useGetUserPurchasedCourseQuery({ pageIndex: 1, pageSize: 50 });
    const selectedCourse = useMemo(
        () => (myCourse?.data?.data || []).find((c) => c.id === courseId),
        [myCourse?.data?.data, courseId]
    );

    const { data: playlist, isLoading } = useGetCourseMediaPlaylistQuery(
        { id: courseId, type: "notes", qp },
        { skip: !courseId }
    );

    const havePurchased =
        selectedCourse?.user?.has_purchased ||
        selectedCourse?.user?.is_free_trial_valid ||
        false;

    if (!courseId) {
        navigate(PATH.NOTES.ROOT, { replace: true });
        return null;
    }

    return (
        <div className="all__note__listing h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <Link to={PATH.NOTES.ROOT} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <IconButton size="small"><ArrowLeft2 size={18} /></IconButton>
                    <span>All Notes</span>
                </Link>
            </div>

            {selectedCourse && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
                </div>
            )}

            <div className="h-full overflow-auto pr-2">
                <CoursePlaylistListing
                    courseId={courseId}
                    type="notes"
                    havePurchased={havePurchased}
                    data={playlist}
                    isLoading={isLoading}
                    qp={qp}
                    setQp={setQp}
                    totalPages={playlist?.data?.pagination?.total_pages || 0}
                />
            </div>
        </div>
    );
}
