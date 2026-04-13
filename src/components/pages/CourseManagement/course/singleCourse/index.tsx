import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetCourseByIdQuery, useGetCourseLiveClassQuery, useGetCourseMediaByTypeQuery, useGetCourseOverviewByIdQuery } from "../../../../../services/courseApi";
import type { QueryParams } from "../../../../../types";
import TabController from "../../../../molecules/TabController";
import CourseBanner from "../../../../organism/CourseBanner";
import PurchaseCourseDialog from "../../../../organism/Dialog/PurchaseCourseDialog";
import CourseMediaListing from "./courseMediaListing";
import SingleCourseCurriculum from "./curriculum";
import SingleCourseLiveClass from "./liveClass";
import SingleCourseOverview from "./overview";
import SingleCourseTest from "./test";

export default function SingleCourse() {
    const { id } = useParams();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("curriculum");
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

    const [qpLiveClass, setQpLiveClass] = useState<QueryParams>({
        pageIndex: 1,
        pageSize: 12,
        search: ""
    })


    // const [searchTest, setSearchTest] = useState("");
    // const [searchLiveClass, setSearchLiveClass] = useState("");


    const { data: courseBasic, isLoading: loadingBasic } = useGetCourseByIdQuery({ id: Number(id) });

    const { data, isLoading: loadingOverview } = useGetCourseOverviewByIdQuery({ id: Number(id) });

    const { data: notes, isLoading: loadingNotes } = useGetCourseMediaByTypeQuery({ id: Number(id), type: "notes", qp: qpNotes }, { skip: !id });
    const { data: audios, isLoading: loadingAudios } = useGetCourseMediaByTypeQuery({ id: Number(id), type: "audios", qp: qpAudios }, { skip: !id });
    const { data: videos, isLoading: loadingVideos } = useGetCourseMediaByTypeQuery({ id: Number(id), type: "videos", qp: qpVideos }, { skip: !id });
    const { data: liveClasses, isLoading: loadingLiveClass } = useGetCourseLiveClassQuery({ id: Number(id), ...qpLiveClass }, { skip: !id });

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

                        ...(videos?.data && videos?.data?.data?.length ? [{
                            label: t("menus.videos"),
                            value: "videos"
                        }] : []),

                        ...(notes?.data && notes?.data?.data?.length ? [{
                            label: t("menus.notes"),
                            value: "notes"
                        }] : []),

                        ...(audios?.data && audios?.data?.data?.length ? [{
                            label: t("menus.audios"),
                            value: "audios"
                        }] : []),

                        {
                            label: t("menus.test"),
                            value: "tests"
                        },

                        ...(liveClasses?.data && liveClasses?.data?.data?.length ? [{
                            label: t("menus.liveClasses"),
                            value: "live_classes"
                        }] : []),
                    ]}
                    setActiveTab={(newValue) => {
                        setActiveTab(newValue);
                    }}
                    currentActive={activeTab}
                />
            </div>

            {activeTab === "overview" && <SingleCourseOverview data={data?.data && data.data} isLoading={loadingOverview} />}
            {activeTab === "curriculum" && <SingleCourseCurriculum havePurchased={havePurchased} />}
            {activeTab === "notes" &&
                <CourseMediaListing havePurchased={havePurchased} data={notes} isLoading={loadingNotes} type="temp_notes" qp={qpNotes} setQp={setQpNotes} totalPages={notes?.data?.pagination?.total_pages || 0} courseId={Number(id)} />
            }
            {activeTab === "audios" &&
                <CourseMediaListing havePurchased={havePurchased} data={audios} isLoading={loadingAudios} type="temp_audios" qp={qpAudios} setQp={setQpAudios} totalPages={audios?.data?.pagination?.total_pages || 0} courseId={Number(id)} />
            }
            {activeTab === "videos" &&
                <CourseMediaListing havePurchased={havePurchased} data={videos} isLoading={loadingVideos} type="temp_video" qp={qpVideos} setQp={setQpVideos} totalPages={videos?.data?.pagination?.total_pages || 0} courseId={Number(id)} />
            }
            {activeTab === "tests" &&
                <SingleCourseTest havePurchased={havePurchased} />
            }
            {activeTab === "live_classes" &&
                <SingleCourseLiveClass havePurchased={havePurchased} data={liveClasses} isLoading={loadingLiveClass} qp={qpLiveClass} setQp={setQpLiveClass} totalPages={liveClasses?.data?.pagination?.total_pages || 0} />
            }
            <PurchaseCourseDialog type={courseBasic?.data?.course_type} />
        </div>
    )
}
