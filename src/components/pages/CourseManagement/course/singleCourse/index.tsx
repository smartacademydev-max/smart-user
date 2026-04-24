import { CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetCourseByIdQuery, useGetCourseCurriculumByIdQuery, useGetCourseLiveClassQuery, useGetCourseMediaPlaylistQuery, useGetCourseOverviewByIdQuery } from "../../../../../services/courseApi";
import type { QueryParams } from "../../../../../types";
import TabController from "../../../../molecules/TabController";
import CourseBanner from "../../../../organism/CourseBanner";
import PurchaseCourseDialog from "../../../../organism/Dialog/PurchaseCourseDialog";
import CoursePlaylistListing from "./coursePlaylistListing";
import SinlgeCourseCurriculum from "./curriculum";
import SinlgeCourseLiveClass from "./liveClass";
import SinlgeCourseOverview from "./overview";
import SinlgeCourseTest from "./test";

export default function SingleCourse() {
    const { id } = useParams();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<string>("");

    const [qpNotes, setQpNotes] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });
    const [qpAudios, setQpAudios] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });
    const [qpVideos, setQpVideos] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });
    const [qpLiveClass, setQpLiveClass] = useState<QueryParams>({ pageIndex: 1, pageSize: 12, search: "" });

    const { data: courseBasic, isLoading: loadingBasic } = useGetCourseByIdQuery({ id: Number(id) });
    const { data: overviewData, isLoading: loadingOverview } = useGetCourseOverviewByIdQuery({ id: Number(id) });
    const { data: curriculumData } = useGetCourseCurriculumByIdQuery({ id: Number(id), pageIndex: 1, pageSize: 50 }, { skip: !id });

    const { data: notesPlaylist, isLoading: loadingNotes } = useGetCourseMediaPlaylistQuery({ id: Number(id), type: "notes", qp: qpNotes }, { skip: !id });
    const { data: audiosPlaylist, isLoading: loadingAudios } = useGetCourseMediaPlaylistQuery({ id: Number(id), type: "audios", qp: qpAudios }, { skip: !id });
    const { data: videosPlaylist, isLoading: loadingVideos } = useGetCourseMediaPlaylistQuery({ id: Number(id), type: "videos", qp: qpVideos }, { skip: !id });
    const { data: liveClasses, isLoading: loadingLiveClass } = useGetCourseLiveClassQuery({ id: Number(id), ...qpLiveClass }, { skip: !id });

    const havePurchased = courseBasic?.data?.user?.has_purchased ||
        courseBasic?.data?.user?.is_free_trial_valid ||
        false;

    const hasOverview = !!(overviewData?.data?.about_this_course || overviewData?.data?.teachers?.length);
    const hasCurriculum = !!(curriculumData?.data?.data?.length);

    const availableTabs = useMemo(() => {
        const tabs: { label: string; value: string }[] = [];

        if (hasOverview) tabs.push({ label: t("messages.overview"), value: "overview" });
        if (hasCurriculum) tabs.push({ label: t("messages.curriculum"), value: "curriculum" });

        if (videosPlaylist?.data?.data?.length) tabs.push({ label: t("menus.videos"), value: "videos" });
        if (notesPlaylist?.data?.data?.length) tabs.push({ label: t("menus.notes"), value: "notes" });
        if (audiosPlaylist?.data?.data?.length) tabs.push({ label: t("menus.audios"), value: "audios" });

        if (courseBasic?.data?.no_of_tests) tabs.push({ label: t("menus.test"), value: "tests" });

        if (liveClasses?.data?.data?.length) tabs.push({ label: t("menus.liveClasses"), value: "live_classes" });

        return tabs;
    }, [hasOverview, hasCurriculum, videosPlaylist, notesPlaylist, audiosPlaylist, courseBasic, liveClasses, t]);

    // Auto-select the first available tab; don't override a user-selected tab if it's still valid
    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find((tab) => tab.value === activeTab)) {
            setActiveTab(availableTabs[0].value);
        }
    }, [availableTabs]);


    if (loadingBasic || loadingOverview) {
        return (
            <div className="h-64 flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }
    return (
        <div className="h-full overflow-auto pr-4">
            <CourseBanner data={courseBasic?.data && courseBasic.data} isLoading={loadingBasic} havePurchased={havePurchased} />
            <div className="my-8">
                <TabController
                    options={availableTabs}
                    setActiveTab={(newValue) => setActiveTab(newValue)}
                    currentActive={activeTab}
                />
            </div>

            {activeTab === "overview" && (
                <SinlgeCourseOverview data={overviewData?.data && overviewData.data} isLoading={loadingOverview} />
            )}
            {activeTab === "curriculum" && (
                <SinlgeCourseCurriculum havePurchased={havePurchased} />
            )}
            {activeTab === "videos" && (
                <CoursePlaylistListing
                    havePurchased={havePurchased}
                    data={videosPlaylist}
                    isLoading={loadingVideos}
                    type="videos"
                    qp={qpVideos}
                    setQp={setQpVideos}
                    totalPages={videosPlaylist?.data?.pagination?.total_pages || 0}
                    courseId={Number(id)}
                />
            )}
            {activeTab === "notes" && (
                <CoursePlaylistListing
                    havePurchased={havePurchased}
                    data={notesPlaylist}
                    isLoading={loadingNotes}
                    type="notes"
                    qp={qpNotes}
                    setQp={setQpNotes}
                    totalPages={notesPlaylist?.data?.pagination?.total_pages || 0}
                    courseId={Number(id)}
                />
            )}
            {activeTab === "audios" && (
                <CoursePlaylistListing
                    havePurchased={havePurchased}
                    data={audiosPlaylist}
                    isLoading={loadingAudios}
                    type="audios"
                    qp={qpAudios}
                    setQp={setQpAudios}
                    totalPages={audiosPlaylist?.data?.pagination?.total_pages || 0}
                    courseId={Number(id)}
                />
            )}
            {activeTab === "tests" && (
                <SinlgeCourseTest havePurchased={havePurchased} />
            )}
            {activeTab === "live_classes" && (
                <SinlgeCourseLiveClass
                    havePurchased={havePurchased}
                    data={liveClasses}
                    isLoading={loadingLiveClass}
                    qp={qpLiveClass}
                    setQp={setQpLiveClass}
                    totalPages={liveClasses?.data?.pagination?.total_pages || 0}
                />
            )}
            <PurchaseCourseDialog type={courseBasic?.data?.course_type} />
        </div>
    );
}
