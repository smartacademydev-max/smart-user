import { Activity, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetCourseByIdQuery, useGetCourseCurriculumByIdQuery, useGetCourseLiveClassQuery, useGetCourseMediaByTypeQuery, useGetCourseOverviewByIdQuery, useGetCourseTestQuery } from "../../../../../services/courseApi";
import type { QueryParams } from "../../../../../types";
import TabController from "../../../../molecules/TabController";
import CourseBanner from "../../../../organism/CourseBanner";
import PurchaseCourseDialog from "../../../../organism/Dialog/PurchaseCourseDialog";
import CourseMediaListing from "./courseMediaListing";
import SinlgeCourseCurriculum from "./curriculum";
import SinlgeCourseLiveClass from "./liveClass";
import SinlgeCourseOverview from "./overview";
import SinlgeCourseTest from "./test";

export default function SingleCourse() {
    const { id } = useParams();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("curriculum");
    // const [havePurchesed, setHavePurchased] = useState(false);
    const [qpNotes, setQpNotes] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12,
        search: ""
    })
    const [qpAudios, setQpAudios] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12,
        search: ""
    })
    const [qpVideos, setQpVideos] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12,
        search: ""
    })

    const [qpTest, setQpTest] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12,
        search: ""
    })
    const [qpLiveClass, setQpLiveClass] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12,
        search: ""
    })


    // const [searchTest, setSearchTest] = useState("");
    // const [searchLiveClass, setSearchLiveClass] = useState("");


    const { data: courseBasic, isLoading: loadingBasic } = useGetCourseByIdQuery({ id: Number(id) });

    const { data, isLoading: loadingOverview } = useGetCourseOverviewByIdQuery({ id: Number(id) });
    const { data: curriculum, isLoading: loadingCurriculum } = useGetCourseCurriculumByIdQuery({ id: Number(id), pageIndex: 1, pageSize: 20 }, { skip: !id });
    const { data: notes, isLoading: loadingNotes } = useGetCourseMediaByTypeQuery({ id: Number(id), type: "notes", qp: qpNotes }, { skip: !id });
    const { data: audios, isLoading: loadingAudios } = useGetCourseMediaByTypeQuery({ id: Number(id), type: "audios", qp: qpAudios }, { skip: !id });
    const { data: videos, isLoading: loadingVideos } = useGetCourseMediaByTypeQuery({ id: Number(id), type: "videos", qp: qpVideos }, { skip: !id });
    const { data: test, isLoading: loadingTest } = useGetCourseTestQuery({ id: Number(id), ...qpTest }, { skip: !id });
    const { data: liveClasses, isLoading: loadingLiveClass } = useGetCourseLiveClassQuery({ id: Number(id), ...qpLiveClass }, { skip: !id })

    const havePurchased = courseBasic?.data?.user?.has_purchased ||
        courseBasic?.data?.user?.is_free_trial_valid ||
        false;

    return (
        <div className="h-full overflow-auto pr-4">
            <CourseBanner data={courseBasic?.data && courseBasic.data} isLoading={loadingBasic} havePurchased={havePurchased} />
            <div className="my-8">
                <TabController
                    options={[
                        {
                            label: t("messages.overview"),
                            value: "overview"
                        },
                        {
                            label: t("messages.curriculum"),
                            value: "curriculum"
                        },
                        {
                            label: t("menus.videos"),
                            value: "videos"
                        },
                        {
                            label: t("menus.notes"),
                            value: "notes"
                        },
                        {
                            label: t("menus.audios"),
                            value: "audios"
                        },
                        {
                            label: t("menus.test"),
                            value: "tests"
                        },
                        {
                            label: t("menus.liveClasses"),
                            value: "live_classes"
                        },
                    ]}
                    setActiveTab={(newValue) => {
                        setActiveTab(newValue);
                    }}
                    currentActive={activeTab}
                />
            </div>

            {activeTab === "overview" && <Activity><SinlgeCourseOverview data={data?.data && data.data} isLoading={loadingOverview} /></Activity>}
            {activeTab === "curriculum" && <Activity><SinlgeCourseCurriculum havePurchased={havePurchased} data={curriculum?.data?.data} isLoading={loadingCurriculum} /></Activity>}
            {activeTab === "notes" && <Activity>
                <CourseMediaListing havePurchased={havePurchased} data={notes} isLoading={loadingNotes} type="temp_notes" qp={qpNotes} setQp={setQpNotes} totalPages={notes?.data?.pagination?.total_pages || 0} courseId={Number(id)} />
            </Activity>}
            {activeTab === "audios" && <Activity>
                <CourseMediaListing havePurchased={havePurchased} data={audios} isLoading={loadingAudios} type="temp_audios" qp={qpAudios} setQp={setQpAudios} totalPages={audios?.data?.pagination?.total_pages || 0} courseId={Number(id)} />
            </Activity>}
            {activeTab === "videos" && <Activity>
                <CourseMediaListing havePurchased={havePurchased} data={videos} isLoading={loadingVideos} type="temp_video" qp={qpVideos} setQp={setQpVideos} totalPages={videos?.data?.pagination?.total_pages || 0} courseId={Number(id)} />
            </Activity>}
            {activeTab === "tests" &&
                <Activity >
                    <SinlgeCourseTest havePurchased={havePurchased} data={test} isLoading={loadingTest} qp={qpTest} setQp={setQpTest} totalPages={test?.data?.pagination?.total_pages || 0} />
                </Activity >}
            {activeTab === "live_classes" && <Activity>
                <SinlgeCourseLiveClass havePurchased={havePurchased} data={liveClasses} isLoading={loadingLiveClass} qp={qpLiveClass} setQp={setQpLiveClass} totalPages={liveClasses?.data?.pagination?.total_pages || 0} />
            </Activity>}
            <PurchaseCourseDialog type={courseBasic?.data?.course_type} />
        </div>
    )
}
