import { Button, Divider, Typography } from "@mui/material";
import { ArrowDown } from "iconsax-reactjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PATH } from "../../../../../../routes/PATH";
import { useGetBundleByOverviewQuery, useGetTestRelatedToBundleQuery } from "../../../../../../services/testApi";
import type { QueryParams } from "../../../../../../types";
import type { QuestionTypeProps } from "../../../../../../types/question";
import { usePaginatedBunldeTests } from "../../../../../../utils/usePaginatedTest";
import { EmptyList } from "../../../../../molecules/EmptyList";
import TabController from "../../../../../molecules/TabController";
import ExploreTestCard from "../../../../../organism/Cards/ExploreTestCard";
import PageHeader from "../../../../../organism/PageHeader";
import TestSection from "../../../../../organism/TestSection";
import SingleBundleOverview from "./SingleBundleOverview";

export default function SingleBundle() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 12
    })
    const [activeTab, setActiveTab] = useState<QuestionTypeProps>("mcq")

    const resetKey = `${activeTab}`;

    const baseParams: QueryParams = {
        pageIndex: 1,
        pageSize: 8,
    };

    const notStarted = usePaginatedBunldeTests(baseParams, activeTab, "not_started", resetKey, Number(id));
    const completed = usePaginatedBunldeTests(baseParams, activeTab, "completed", resetKey, Number(id));
    const awaiting = usePaginatedBunldeTests(baseParams, activeTab, "awaiting", resetKey, Number(id));
    const expired = usePaginatedBunldeTests(baseParams, activeTab, "expired", resetKey, Number(id));

    const { data: overview } = useGetBundleByOverviewQuery({ id: Number(id) }, { skip: !id });
    const { data } = useGetTestRelatedToBundleQuery({ ...qp, id: Number(id), type: activeTab }, { skip: !id })

    const getCountByLabel = (label: string) => {
        return overview?.data?.sets?.find(
            (item) => item.label === label
        )?.value || null;
    };
    return (
        <>
            <PageHeader
                breadcrumb={[
                    { title: "Bundle Tests", url: PATH.TEST.EXPLORE_TEST.BUNDLE_TEST.ROOT },
                    { title: overview?.data?.name || "" }
                ]}
            />
            <div className="h-full overflow-auto pr-2">
                {overview ? <SingleBundleOverview data={overview.data} /> : ""}

                <Typography variant="h4" className="mt-4! lg:mt-8!" fontWeight={600}>{t("messages.tests_in_this_bundle")}</Typography>
                <Divider className="mt-3! mb-6!" />
                <TabController
                    currentActive={activeTab}
                    setActiveTab={setActiveTab}
                    options={[
                        { label: "MCQ", value: "mcq", count: getCountByLabel("objective") },
                        { label: "Subjective", value: "subjective", count: getCountByLabel("subjective") },
                        { label: "OMR", value: "omr", count: getCountByLabel("omr") },
                    ]}
                />

                {overview?.data?.has_purchased ? <div className="media__listing__wrapper h-full pr-2 mt-3">
                    <TestSection
                        title="Not Started"
                        description="Tests you have purchased but haven't taken yet."
                        {...notStarted}
                        onLoadMore={notStarted.loadMore}
                        status="not_started"
                    />
                    <TestSection
                        title="Completed"
                        description="Tests that are finished. You can view your results here."
                        {...completed}
                        onLoadMore={completed.loadMore}
                        status="completed"

                    />
                    <TestSection
                        title="Awaiting Review"
                        description="Tests submitted and currently being reviewed by your teacher."
                        {...awaiting}
                        onLoadMore={awaiting.loadMore}
                        showDivider={true}
                        status="awaiting"
                    />
                    <TestSection
                        title="Expired"
                        description="Tests expired and you missed to submit this test on scheduled time."
                        {...expired}
                        onLoadMore={expired.loadMore}
                        showDivider={false}
                        status="expired"
                    />
                </div> : <>
                    <div className="explore_all__test__root  pt-4 pr-2">
                        {data && data?.data?.data?.length > 0 ? <>
                            <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-6 ">
                                {data?.data?.data?.map((test) => (
                                    <ExploreTestCard
                                        test={test}
                                        key={test.id}
                                        showAction={false}
                                    />
                                ))}
                            </div>

                        </>
                            : <EmptyList
                                title="No Test Found"
                                description="There are no tests available for the selected course."
                            />}
                    </div>
                    {qp.pageIndex < (data?.data?.pagination?.total_pages || 0) && (
                        <div className="text-center mt-3">
                            <Button variant="text" color="primary" endIcon={<ArrowDown />} onClick={() => setQp(prev => ({
                                ...prev,
                                pageIndex: prev.pageIndex + 1
                            }))}>{t("messages.load_more")}</Button>
                        </div>)}
                </>
                }
            </div >
        </>
    )
}
