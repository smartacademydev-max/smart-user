import { CircularProgress } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useGetCourseByIdQuery, useGetCourseCurriculumByIdQuery, useGetCourseLiveClassQuery, useGetCourseMediaPlaylistQuery, useGetCourseOverviewByIdQuery, usePurchaseCourseMutation } from "../../../../../services/courseApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import type { QueryParams } from "../../../../../types";
import TabController from "../../../../molecules/TabController";
import CourseBanner from "../../../../organism/CourseBanner";
import PurchaseCourseDialog from "../../../../organism/Dialog/PurchaseCourseDialog";
import CoursePlaylistListing from "./coursePlaylistListing";
import SingleCourseCurriculum from "./curriculum";
import SingleCourseLiveClass from "./liveClass";
import MyCourseBanner from "./myCourseView/MyCourseBanner";
import MyCourseSidebar from "./myCourseView/MyCourseSidebar";
import SingleCourseOverview from "./overview";
import SingleCourseTest from "./test";

export default function SingleCourse() {
    const { id } = useParams();
    const { t } = useTranslation();
    const location = useLocation();
    const isMyCourseView = location.pathname.startsWith("/my-course/");

    // The open tab lives in the URL (?tab=tests) so a refresh or a deep link from the
    // WordPress site lands on it; an unavailable tab falls back to the first one.
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTab = searchParams.get("tab") ?? "";
    const setActiveTab = (tab: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("tab", tab);
            next.delete("category"); // tab-specific selections don't carry across tabs
            return next;
        }, { replace: true });
    };

    const [qpNotes, setQpNotes] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });
    const [qpAudios, setQpAudios] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });
    const [qpVideos, setQpVideos] = useState<QueryParams>({ pageIndex: 1, pageSize: 12 });
    const [qpLiveClass, setQpLiveClass] = useState<QueryParams>({ pageIndex: 1, pageSize: 12, search: "" });

    const { data: courseBasic, isLoading: loadingBasic } = useGetCourseByIdQuery({ id: Number(id) });
    const { data: overviewData, isLoading: loadingOverview } = useGetCourseOverviewByIdQuery({ id: Number(id) });
    const { data: curriculumData, isLoading: loadingCurriculum } = useGetCourseCurriculumByIdQuery({ id: Number(id), pageIndex: 1, pageSize: 50 }, { skip: !id });

    const { data: notesPlaylist, isLoading: loadingNotes } = useGetCourseMediaPlaylistQuery({ id: Number(id), type: "notes", qp: qpNotes }, { skip: !id });
    const { data: audiosPlaylist, isLoading: loadingAudios } = useGetCourseMediaPlaylistQuery({ id: Number(id), type: "audios", qp: qpAudios }, { skip: !id });
    const { data: videosPlaylist, isLoading: loadingVideos } = useGetCourseMediaPlaylistQuery({ id: Number(id), type: "videos", qp: qpVideos }, { skip: !id });
    const { data: liveClasses, isLoading: loadingLiveClass } = useGetCourseLiveClassQuery({ id: Number(id), ...qpLiveClass }, { skip: !id });

    const havePurchased = courseBasic?.data?.user?.has_purchased ||
        courseBasic?.data?.user?.is_free_trial_valid ||
        false;

    // Arriving from a campaign link (?campaign=CODE) on a free course the student doesn't own
    // yet: enroll them. Brand-new sign-ups are enrolled by the backend at registration; this
    // covers students who were already registered or signed in. The code is dropped from the
    // URL afterwards so a refresh doesn't retry.
    const campaign = searchParams.get("campaign");
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [purchaseCourse] = usePurchaseCourseMutation();
    const campaignEnrollTried = useRef(false);
    useEffect(() => {
        const course = courseBasic?.data;
        if (!campaign || !user || !course || campaignEnrollTried.current) return;
        campaignEnrollTried.current = true;

        const dropCampaign = () => setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("campaign");
            return next;
        }, { replace: true });

        if (course.course_type !== "free" || course.user?.has_purchased) {
            dropCampaign();
            return;
        }

        purchaseCourse({
            body: {
                payment_method: "free",
                transaction_amount: "0",
                transaction_status: "success",
                transaction_id: `CAMPAIGN-${campaign}-${user.id}-${id}`,
                reference_id: `CAMPAIGN-${campaign}-${user.id}-${id}`,
                is_trial: false,
            },
            id: Number(id),
            moduleType: "course",
        }).unwrap()
            .then((response) => dispatch(showToast({ message: response?.message || "Enrolled Successfully", severity: "success" })))
            .catch(() => { /* already enrolled or not assignable: the page shows its normal state */ })
            .finally(dropCampaign);
    }, [campaign, user, courseBasic, id, purchaseCourse, dispatch, setSearchParams]);

    const hasOverview = !!(overviewData?.data?.about_this_course || overviewData?.data?.teachers?.length);
    const hasCurriculum = !!(curriculumData?.data?.data?.length);

    const availableTabs = useMemo(() => {
        const tabs: { label: string; value: string }[] = [];

        if (hasOverview) tabs.push({ label: t("messages.overview"), value: "overview" });
        if (hasCurriculum) tabs.push({ label: t("messages.curriculum"), value: "curriculum" });

        if (videosPlaylist?.data?.data?.length) tabs.push({ label: t("menus.videos"), value: "videos" });
        if (notesPlaylist?.data?.data?.length) tabs.push({ label: t("menus.notes"), value: "notes" });
        if (audiosPlaylist?.data?.data?.length) tabs.push({ label: t("menus.audios"), value: "audios" });

        if (courseBasic?.data?.no_of_test_category) tabs.push({ label: t("menus.test"), value: "tests" });

        if (liveClasses?.data?.data?.length) tabs.push({ label: t("menus.liveClasses"), value: "live_classes" });

        return tabs;
    }, [hasOverview, hasCurriculum, videosPlaylist, notesPlaylist, audiosPlaylist, courseBasic, liveClasses, t]);

    // Tabs appear as their queries resolve, so a requested tab that isn't listed yet may
    // still be coming — only fall back once every tab-deciding query has settled.
    const tabsSettled = !loadingCurriculum && !loadingVideos && !loadingNotes && !loadingAudios && !loadingLiveClass;
    const isRequestedAvailable = availableTabs.some((tab) => tab.value === requestedTab);
    const activeTab = isRequestedAvailable
        ? requestedTab
        : requestedTab && !tabsSettled
            ? ""
            : availableTabs[0]?.value ?? "";


    if (loadingBasic || loadingOverview) {
        return (
            <div className="h-64 flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }
    const tabContent = (
        <>
            <div className="my-8">
                <TabController
                    options={availableTabs}
                    setActiveTab={(newValue) => setActiveTab(newValue)}
                    currentActive={activeTab}
                />
            </div>

            {activeTab === "overview" && (
                <SingleCourseOverview data={overviewData?.data && overviewData.data} isLoading={loadingOverview} />
            )}
            {activeTab === "curriculum" && (
                <SingleCourseCurriculum havePurchased={havePurchased} />
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
                <SingleCourseTest havePurchased={havePurchased} />
            )}
            {activeTab === "live_classes" && (
                <SingleCourseLiveClass
                    havePurchased={havePurchased}
                    data={liveClasses}
                    isLoading={loadingLiveClass}
                    qp={qpLiveClass}
                    setQp={setQpLiveClass}
                    totalPages={liveClasses?.data?.pagination?.total_pages || 0}
                />
            )}
        </>
    );

    if (isMyCourseView) {
        return (
            <div className="h-full overflow-auto pr-4">
                <div className="lg:grid lg:grid-cols-12 lg:gap-6">
                    <div className="lg:col-span-12">
                        <MyCourseBanner data={courseBasic?.data} />
                    </div>

                    <div className="lg:col-span-8 xl:col-span-8 ">
                        {tabContent}
                    </div>
                    <aside className="relative z-10 mt-4 lg:-mt-70 lg:col-span-4 2xl:col-span-3 lg:mr-4">
                        <MyCourseSidebar data={courseBasic?.data} />
                    </aside>
                </div>
                <PurchaseCourseDialog type={courseBasic?.data?.course_type} />
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto pr-4">
            <CourseBanner data={courseBasic?.data && courseBasic.data} isLoading={loadingBasic} havePurchased={havePurchased} />
            {tabContent}
            <PurchaseCourseDialog type={courseBasic?.data?.course_type} />
        </div>
    );
}
